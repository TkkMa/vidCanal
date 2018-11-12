import _ from 'lodash';
import moment from 'moment';
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {YTSearch, YTVideo} from './YTSearch';
import VideoDetail from './VideoDetail';
import VideoList from './VideoList';
import VideoListFilters from './VideoListFilters';
import { setVideos, startSelectVideo, setReRender } from '../actions/videos';


class VideoApp extends Component{
    //-- 'lastPageReached' accounts for an API call with *page token*, BUT no videos returned.  Disables next page button
    state={
        pageActive: 1,
        maxViewedPage: 1,
        lastPageReached: false,
        lastPageFound: false,  //-- designed for the end of page click
        error: null,
        reRender: true
    }

    //-- Runs everytime except when first loading the app
    //-- didMount stops API call when item from history selected as API call has ran in componentDidMount()
    //-- (1) Direct to '/' (2) searching term from different page leads top equal prevProps and this.props 
    //-- due to the setState re-rendering in componentDidMount()
    componentDidUpdate (prevProps){
        // console.log('VideoApp componentDidUpdate initialized');
        if(this.props.didMount && this.props.searchKey !== prevProps.searchKey){
            // console.log('inside if statement VideoApp componentDidUpdate')
            this.videoSearch(this.props.searchKey, 'first_page');
        }
    }

    //-- Runs only (1) upon first loading app AND (2) when navigating to root path from other paths '/*'
    //-- componentDidMount runs prior to componentDidUpdate when DOM needs to be mounted
    //-- setTimeout is necessary to account for case when history item is clicked and searchKey does not immediately update
    componentDidMount(){
        // console.log('VideoApp componentDidMount initialized', this.props.didMount);
        setTimeout(()=>{this.videoSearch(this.props.searchKey)}, 1000);
    }
    
    vidSearchInputs =(pageToggle, uploadDate) => new Promise((resolve)=>{
        let {pageActive, maxViewedPage} = this.state;
        switch (pageToggle){
            case 'first_page':
                pageActive = 1;
                break;
            case 'chevron_left':
                pageActive = Math.max(pageActive-1, 1);
                break;
            case 'chevron_right':
                pageActive = pageActive + 1;
                maxViewedPage = Math.max(pageActive, maxViewedPage);
                break;
            case 'last_page':
                pageActive = maxViewedPage;
                break;
            default:
                pageActive = 1;
                maxViewedPage = 1;
        }
        let sortTimeVal;
        switch(uploadDate){
            case 'today':
                sortTimeVal = moment().startOf('day').format();
                break;
            case 'week':
                sortTimeVal = moment().startOf('week').format();
                break;
            case 'month':
                sortTimeVal =  moment().startOf('month').format();
                break;
            case 'year':
                sortTimeVal = moment().startOf('year').format();
                break;
            case 'fiveYears':
                sortTimeVal = moment().subtract(5, 'years').format();
                break;
            case 'allTime':
                sortTimeVal = '';
                break;                               
            default:
                sortTimeVal = '';
        };
        resolve({pageActive, maxViewedPage, sortTimeVal});
    })

    videoSearch = async (term=this.props.searchKey, pageToggle='') => {

        const {nextPageToken, results, resultDetail, resultsPerPage, sortBy, uploadDate} = this.props;

        //-- Determine current and max page numbers and moment date for API call
        const {pageActive, maxViewedPage, sortTimeVal} = await this.vidSearchInputs(pageToggle, uploadDate);
        // console.log('videoSearch chk pt1'); 
        this.setState({ error: null, lastPageReached: false, pageActive, maxViewedPage });

        //-- For caching -- use term instead of searchKey as the latter is not set yet
        const oldHits = pageToggle && (results && results[term])? results[term].hits : [];
        const oldHitSelect = pageToggle && (resultDetail && resultDetail[term])? resultDetail[term].hits : [];

        //-- If video list has been explored, do not fetch list from API.  updatedHitSelect will therefore not contain duplicates
        if(this.props.reRender && oldHits.length>((maxViewedPage-1)*resultsPerPage)){
            const index_OH = (pageActive-1)*resultsPerPage;
            const index_OHS = oldHitSelect.findIndex(video=>video.id===oldHits[index_OH].id.videoId);
            // console.log('videoSearch chk pt2');
            this.props.startSelectVideo({
                searchKey: term, 
                updatedHitSelect: oldHitSelect, 
                video: [oldHitSelect[index_OHS]],
                viewedAt: moment().utc().toISOString()
            });
        } else {
            // Call youtubeAPI and fetch new videos
            // -- Three situations: 
            //    1. Zero videos retrieved 
            //        a. after a few pages -- define pages, config lastPageReached, lastPageFound for button appearance
            //        b. on the first page -- update redux and display message that no videos found
            //    2. Videos<resultsPerPage retrieved -- config lastPageReached, lastPageFound
            //    3. Videos=resultPerPage retrieved -- update redux video data
            // console.log(`Begin to call YT search for searchKey ${term}`);
            const pageToken = nextPageToken;
            try{
                const videos = await YTSearch({num: resultsPerPage, term, sortBy, sortTimeVal, pageToken});
                if(!videos.items.length){
                    throw new Error('No videos found with selected criteria.  Please search again.')
                } else if(videos.items.length < resultsPerPage){
                    this.setState(prevState => ({
                        lastPageReached: !prevState.lastPageReached,
                        lastPageFound: true
                    }))
                };
                const updatedHits = [...oldHits, ...videos.items];
                // console.log('VideoSearch chk pt3');
                this.props.setVideos({
                    searchKey:term,
                    updatedHits,
                    nextPageToken: videos.nextPageToken
                });

                //-- Condition for clicking history item -- do not update VideoDetail component
                if(this.props.reRender){
                    // console.log('Begin YTVideo search');
                    const video = await YTVideo({id:videos.items[0].id.videoId}); // Array with one element returned
                    const updatedHitSelect = [...oldHitSelect, ...video];
                    // console.log('VideoSearch chk pt4');
                    this.props.startSelectVideo({
                        searchKey:term,
                        updatedHitSelect, 
                        video: video,
                        viewedAt: moment().utc().toISOString()
                    });
                }
            } catch(error){
                console.log(error);
                this.setState(prevState => ({
                    pageActive: Math.max(prevState.pageActive -1,1),
                    maxViewedPage: Math.max(prevState.maxViewedPage -1, 1),
                    lastPageReached: !prevState.lastPageReached,
                    lastPageFound: true
                }))
                if(pageActive ===1 && maxViewedPage===1){
                    this.props.setVideos({
                        searchKey:term,
                        updatedHits:[],
                        nextPageToken: ''
                    });
                    this.setState({error: error.message});
                }
            }
        }
    }

    onSearchFilterChange = ()=>{
        this.props.setReRender(true);
        this.videoSearch();
    }

    render(){
        const onNumResultsChange = _.debounce(()=>{this.onSearchFilterChange()},500);
        const {pageActive, lastPageReached, lastPageFound, error} = this.state;
        const {nextPageToken, resultsPerPage, selectedVideo} = this.props;

        return(
            <div className="container">
                <VideoListFilters 
                    onSortByTimeChange={this.onSearchFilterChange}
                    onNumChange={onNumResultsChange}
                />
                {(error && this.state.reRender) ? (
                        <div>
                            <p>{error}</p>
                        </div>
                    ) : (
                        <div className="VA-1 row">
                            <VideoDetail video={selectedVideo}/>
                            <VideoList
                                pageActive={pageActive}
                                pageToken={nextPageToken} 
                                onPageChange={this.videoSearch}
                                lastPageReached={lastPageReached}
                                lastPageFound={lastPageFound}
                                numResults={resultsPerPage}
                                error={error}
                            />
                        </div>
                    )
                }
            </div>
        );
    };
};

const mapStateToProps = (state)=>({
    nextPageToken: state.videos.nextPageToken,
    results: state.videos.results,
    resultDetail: state.videos.resultDetail,
    reRender: state.videos.reRender,
    didMount: state.videos.didMount,
    selectedVideo: state.videos.selectedVideo,
    sortBy: state.filters.sortBy,
    uploadDate: state.filters.uploadDate,
    resultsPerPage: state.filters.resultsPerPage
});  

const mapDispatchToProps = (dispatch)=>({
    setVideos: (videos)=> dispatch(setVideos(videos)),
    startSelectVideo: (video)=> dispatch(startSelectVideo(video)),
    setReRender : (isReRender) => dispatch(setReRender(isReRender))
});

export default connect(mapStateToProps, mapDispatchToProps)(VideoApp)