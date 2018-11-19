import _ from 'lodash';
import moment from 'moment';
import React, {Component} from 'react';
import {connect} from 'react-redux';
import {vidAPISearch, indVidAPISearch} from './APISearch';
import VideoDetail from './VideoDetail';
import VideoList from './VideoList';
import VideoListFilters from './VideoListFilters';
import { startSetVideos, startSelectVideo, setReRender } from '../actions/videos';
import { setPlayer } from '../actions/filters';
import { setPageConfig, setPageToken, clearAllPageToken } from '../actions/pagination';
import { vidSearchInputs, isLastPageFunc } from '../selectors/videos';
import {videoListObj, videoDetailArr} from '../fixtures/vidFieldNorm';

const defaultSearchEngine = 'YT';
const resetTab = {YT: false, V: false, D: false};

class VideoApp extends Component{
    //-- 'emptyItemSet' accounts for an API call with *page token*, BUT no videos returned.  Disables next page button
    state={
        error:{
            YT: null,
            V: null,
            D: null
        },
        reRender: true,
        chkBox:{    
            YT:true,    
            V: false,
            D: false
        },
        isActiveTab:{
            YT: true,
            V: false,
            D: false
        }
    }

    //-- didMount stops API call when item from history selected as API call has ran in componentDidMount()
    //-- (1) Direct to '/' (2) searching term from different page leads top equal prevProps and this.props 
    //-- due to the setState re-rendering in componentDidMount()
    componentDidUpdate (prevProps){
        if(this.props.searchKey !== prevProps.searchKey){
            this.setState({ error: {YT:null, V:null, D:null} });
            this.props.clearAllPageToken();
            const keyArray = _.keys(_.pickBy(this.state.chkBox));
            keyArray.forEach((key)=>{
                this.videoSearch(this.props.searchKey, key, 'first_page');
            })
        }
    }

    //-- Runs only (1) upon first loading app AND (2) when navigating to root path from other paths '/*'
    //-- componentDidMount runs prior to componentDidUpdate when DOM needs to be mounted
    //-- setTimeout is necessary to account for case when history item is clicked and searchKey does not immediately update
    componentDidMount(){
        const {YT, V, D} = this.props.playerChecked;
        this.setState({chkBox:{ YT, V, D }},()=>{
            if(this.props.didMount){
                setTimeout(()=>{this.videoSearch(this.props.searchKey, )}, 500);
            }
        });
    }
    
    //-- Store final checkbox state prior to leaving page
    componentWillUnmount(){
        this.props.setPlayer(this.state.chkBox);
    }

    videoSearch = async (term=this.props.searchKey, engine=defaultSearchEngine, pageToggle='') => {

        const {results, resultDetail, sortBy, uploadDate, page} = this.props;

        //-- Determine current and max page numbers and moment date for API call
        const {pageActive, maxViewedPage, sortTimeVal} = await vidSearchInputs(pageToggle, uploadDate, 
                                                            {pageActive: page.pageActive[engine], 
                                                            maxViewedPage: page.maxViewedPage[engine]});
        // console.log('videoSearch chk pt1'); 
        this.props.setPageConfig({
            lastPageReached: false,
            pageActive,
            maxViewedPage,
            engine
        });

        //-- For caching -- use term instead of searchKey as the latter is not set yet
        //-- An empty string for pageToggle resets the array -- see componentDidMount
        const oldHits = pageToggle && (results[engine] && results[engine][term])? results[engine][term].hits : [];
        const oldHitSelect = pageToggle && (resultDetail[engine] && resultDetail[engine][term])? resultDetail[engine][term].hits : [];

        //-- If video list has been explored, do not fetch list from API.  updatedHitSelect will therefore not contain duplicates
        if(this.props.reRender && oldHits.length>((maxViewedPage-1)*page.resultsPerPage)){
            const index_OH = (pageActive-1)*page.resultsPerPage;
            const index_OHS = oldHitSelect.findIndex(video=>video.id=== oldHits[index_OH].id);

            this.props.startSelectVideo({
                searchKey: term, 
                updatedHitSelect: oldHitSelect, 
                video: [oldHitSelect[index_OHS]],
                viewedAt: moment().utc().toISOString(),
                engine
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
                if(!videos.items.length){ throw new Error(`No videos found with selected criteria under ${engine}.  Please search again.`)}
                const normVideos = videoListObj(videos, engine);

                //-- Error handling and last page treatment
                
                const isLastPage = isLastPageFunc(normVideos, page, engine);

                console.log(`isLastPage for ${engine} `, isLastPage)
                if(isLastPage){
                    this.props.setPageConfig({
                        lastPageReached: true,
                        lastPageFound: true,
                        engine
                    });
                };
                
                //-- Populate results object in Redux store used in video list
                const updatedHits = [...oldHits, ...normVideos.items];
                console.log(`updatedHits for ${engine}: `, updatedHits);
                this.props.startSetVideos({
                    searchKey:term,
                    updatedHits,    
                    engine
                });

                this.props.setPageToken({nextPageToken: normVideos.nextPageToken, engine})

                //-- Condition for clicking history item -- do not update VideoDetail component
                //-- 'video' is an ARRAY with ONE element
                if(this.props.reRender){
                    console.log(`Begin individual API Search ${engine}`);
                    const video = await indVidAPISearch(normVideos.items[0], engine); // Array with one element returned
                    const normVideo = videoDetailArr(video[0], engine); // Normalise to have same fields in element

                    const updatedHitSelect = [...oldHitSelect, ...normVideo];
                    this.props.startSelectVideo({
                        searchKey:term,
                        updatedHitSelect, 
                        video: normVideo,
                        viewedAt: moment().utc().toISOString(),
                        engine
                    }).then(()=>{
                        this.setState(()=>({
                            isActiveTab: {
                                ...resetTab,
                                [engine]: true
                            }
                        }))
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
                    this.props.startSetVideos({
                        searchKey:term,
                        updatedHits:[],
                        engine
                    });
                    const defaultToken = (engine==='YT')? '' : 1;
                    this.props.setPageToken({nextPageToken: defaultToken, engine});
                    this.setState(prevState=>({
                        error: {
                            ...prevState.error,
                            [engine]: error.message
                        },
                        isActiveTab: {
                            ...resetTab,
                            [engine]: true
                        }
                    }));
                }
            }
        }
    }

    onSearchFilterChange = ()=>{
        this.props.setReRender(true);
        const keyArray = _.keys(_.pickBy(this.state.chkBox));
        keyArray.forEach((key)=>{
            this.videoSearch(undefined, key, '');
        })
    }

    onPlayerCheck = (e)=>{
        const name = e.target.getAttribute('name');
        this.setState(prevState=>({
            chkBox:{
                ...prevState.chkBox,
                [name]: !prevState.chkBox[name]
            }
        }), ()=>{
            if (this.state.chkBox[name]) {this.videoSearch(undefined, name)}
        });
    };

    isActiveTab = (tab) =>{
        this.setState(()=>({
            isActiveTab: {
                ...resetTab,
                [tab]: true
            }
        }));
    }

    render(){
        const onNumResultsChange = _.debounce(()=>{this.onSearchFilterChange()},500);
        const {error, isActiveTab, reRender, chkBox} = this.state;
        const {selectedVideo} = this.props;
        const activeTab = _.findKey(isActiveTab);

        return(
            // (!selectedVideo[activeTab])?
            //     (<div><LoadingPage /></div>) : ( 
                <div className="container">
                    <VideoListFilters 
                        onSortByTimeChange={this.onSearchFilterChange}
                        onNumChange={onNumResultsChange}
                        onPlayerCheck={this.onPlayerCheck}
                        valueCheck={chkBox}
                        tabStatus={isActiveTab}
                    />
                    {
                        // (error[activeTab] && reRender) ? (
                        //     <div>
                        //         <p>{error[activeTab]}</p>
                        //     </div>
                        // ) : (
                            <div className="VA-1 row">
                                <VideoDetail 
                                    video={selectedVideo[activeTab]}
                                    error={error[activeTab]}
                                />
                                <VideoList
                                    onPageChange={this.videoSearch}
                                    error={error[activeTab]}
                                    playerChecked={chkBox}
                                    video={selectedVideo[activeTab]}
                                    onTabChange={this.isActiveTab}
                                    activeTab={activeTab}
                                />
                            </div>
                        // )
                    }
                </div>
            )
        // );
    };
};

const mapStateToProps = ({videos, filters, page})=>({
    results: videos.results,
    resultDetail: videos.resultDetail,
    reRender: videos.reRender,
    didMount: videos.didMount,
    selectedVideo: videos.selectedVideo,
    sortBy: filters.sortBy,
    uploadDate: filters.uploadDate,
    playerChecked: filters.playerChecked,
    page: page
});  

const mapDispatchToProps = (dispatch)=>({
    startSetVideos: (videos)=> dispatch(startSetVideos(videos)),
    startSelectVideo: (video)=> dispatch(startSelectVideo(video)),
    setReRender : (isReRender) => dispatch(setReRender(isReRender)),
    setPageConfig: (pagination) => dispatch(setPageConfig(pagination)),
    setPageToken: (token) => dispatch(setPageToken(token)),
    setPlayer: (choice)=> dispatch(setPlayer(choice)),
    clearAllPageToken: ()=> dispatch(clearAllPageToken())
});

export default connect(mapStateToProps, mapDispatchToProps)(VideoApp)