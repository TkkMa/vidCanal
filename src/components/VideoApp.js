import _ from 'lodash';
import moment from 'moment';
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {vidAPISearch, indVidAPISearch} from './APISearch';
import VideoDetail from './VideoDetail';
import VideoList from './VideoList';
import VideoListFilters from './VideoListFilters';
import { setVideos, startSelectVideo, setReRender } from '../actions/videos';
import { setPageConfig, setPageToken } from '../actions/pagination';
import { vidSearchInputs } from '../selectors/videos';
const defaultSearchEngine = 'YT';

class VideoApp extends Component{
    //-- 'emptyItemSet' accounts for an API call with *page token*, BUT no videos returned.  Disables next page button
    state={
        error: null,
        reRender: true,
        chkBox:{    D: false,
                    V: false,
                    YT:true
        }
    }

    //-- Runs everytime except when first loading the app
    //-- didMount stops API call when item from history selected as API call has ran in componentDidMount()
    //-- (1) Direct to '/' (2) searching term from different page leads top equal prevProps and this.props 
    //-- due to the setState re-rendering in componentDidMount()
    componentDidUpdate (prevProps){
        // console.log('VideoApp componentDidUpdate initialized');
        if(this.props.didMount && this.props.searchKey !== prevProps.searchKey){
            // console.log('inside if statement VideoApp componentDidUpdate')
            this.videoSearch(this.props.searchKey, undefined, 'first_page');
        }
    }

    //-- Runs only (1) upon first loading app AND (2) when navigating to root path from other paths '/*'
    //-- componentDidMount runs prior to componentDidUpdate when DOM needs to be mounted
    //-- setTimeout is necessary to account for case when history item is clicked and searchKey does not immediately update
    componentDidMount(){
        // console.log('VideoApp componentDidMount initialized', this.props.didMount);
        setTimeout(()=>{this.videoSearch(this.props.searchKey)}, 1000);
    }
    
    
    videoSearch = async (term=this.props.searchKey, engine=defaultSearchEngine, pageToggle='') => {

        const {results, resultDetail, sortBy, uploadDate, page} = this.props;

        //-- Determine current and max page numbers and moment date for API call
        const {pageActive, maxViewedPage, sortTimeVal} = await vidSearchInputs(pageToggle, uploadDate, 
                                                            {pageActive: page.pageActive[engine], 
                                                            maxViewedPage: page.maxViewedPage[engine]});
        // console.log('videoSearch chk pt1'); 
        this.setState({ error: null });
        this.props.setPageConfig({
            lastPageReached: false, 
            pageActive, 
            maxViewedPage,
            engine
        });

        //-- For caching -- use term instead of searchKey as the latter is not set yet
        const oldHits = pageToggle && (results && results[engine][term])? results[engine][term].hits : [];
        const oldHitSelect = pageToggle && (resultDetail && resultDetail[engine][term])? resultDetail[engine][term].hits : [];

        //-- If video list has been explored, do not fetch list from API.  updatedHitSelect will therefore not contain duplicates
        if(this.props.reRender && oldHits.length>((maxViewedPage-1)*page.resultsPerPage)){
            const index_OH = (pageActive-1)*page.resultsPerPage;
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
            try{
                const videos = await vidAPISearch({num: page.resultsPerPage, term, sortBy, sortTimeVal, pageToken: page.nextPageToken}, engine);
                console.log('engine', engine);
                console.log('videos', videos);

                if(!videos.items.length){
                    throw new Error('No videos found with selected criteria.  Please search again.')
                } else if(videos.items.length < page.resultsPerPage){
                    this.props.setPageConfig({
                        lastPageReached: true,
                        lastPageFound: true,
                        engine
                    });
                };
                const updatedHits = [...oldHits, ...videos.items];
                // console.log('VideoSearch chk pt3');
                this.props.setVideos({
                    searchKey:term,
                    updatedHits,    
                    engine
                });
                this.props.setPageToken({nextPageToken: videos.nextPageToken, engine})

                //-- Condition for clicking history item -- do not update VideoDetail component
                if(this.props.reRender){
                    // console.log('Begin YTVideo search');
                    const video = await indVidAPISearch(videos.items[0], engine); // Array with one element returned
                    console.log('engine Detail', engine);
                    console.log('videoDetail', video);
                    const updatedHitSelect = [...oldHitSelect, ...video];
                    // console.log('VideoSearch chk pt4');
                    this.props.startSelectVideo({
                        searchKey:term,
                        updatedHitSelect, 
                        video: video,
                        viewedAt: moment().utc().toISOString(),
                        engine
                    });
                }
            } catch(error){
                console.log(error);
                this.props.setPageConfig({
                    pageActive: Math.max(page.pageActive[engine] -1,1),
                    maxViewedPage: Math.max(page.maxViewedPage[engine]-1, 1), 
                    lastPageReached: true,
                    lastPageFound: true,
                    engine
                });
                if(pageActive ===1 && maxViewedPage===1){
                    this.props.setVideos({
                        searchKey:term,
                        updatedHits:[],
                        engine
                    });
                    this.props.setPageToken({nextPageToken: '', engine})
                    this.setState({error: error.message});
                }
            }
        }
    }

    onSearchFilterChange = ()=>{
        this.props.setReRender(true);
        this.videoSearch();
    }

    onPlayerCheck = (e)=>{
        const name = e.target.getAttribute('name');
        this.setState(prevState=>({
            chkBox:{
                ...prevState.chkBox,
                [name]: !prevState.chkBox[name]
            }
        }));
        if (this.state.chkBox[name]){this.videoSearch(undefined, name);};
    };

    render(){
        const onNumResultsChange = _.debounce(()=>{this.onSearchFilterChange()},500);
        const {error} = this.state;
        const {selectedVideo} = this.props;

        return(
            <div className="container">
                <VideoListFilters 
                    onSortByTimeChange={this.onSearchFilterChange}
                    onNumChange={onNumResultsChange}
                    onPlayerCheck={this.onPlayerCheck}
                    valueCheck={this.state.chkBox}
                />
                {(error && this.state.reRender) ? (
                        <div>
                            <p>{error}</p>
                        </div>
                    ) : (
                        <div className="VA-1 row">
                            <VideoDetail video={selectedVideo}/>
                            <VideoList
                                onPageChange={this.videoSearch}
                                error={error}
                                playerChecked={this.state.chkBox}
                            />
                        </div>
                    )
                }
            </div>
        );
    };
};

const mapStateToProps = (state)=>({
    results: state.videos.results,
    resultDetail: state.videos.resultDetail,
    reRender: state.videos.reRender,
    didMount: state.videos.didMount,
    selectedVideo: state.videos.selectedVideo,
    sortBy: state.filters.sortBy,
    uploadDate: state.filters.uploadDate,
    page: state.page
});  

const mapDispatchToProps = (dispatch)=>({
    setVideos: (videos)=> dispatch(setVideos(videos)),
    startSelectVideo: (video)=> dispatch(startSelectVideo(video)),
    setReRender : (isReRender) => dispatch(setReRender(isReRender)),
    setPageConfig: (pagination) => dispatch(setPageConfig(pagination)),
    setPageToken: (token) => dispatch(setPageToken(token))
});

export default connect(mapStateToProps, mapDispatchToProps)(VideoApp)