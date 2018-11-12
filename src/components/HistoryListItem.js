import React, {Component} from "react";
import {connect} from 'react-redux';
import moment from "moment";
import {startSelectVideo, startSaveVideo} from "../actions/videos";
import {addFavCount, removeFavCount} from '../actions/filters';
import {history} from '../routers/AppRouter';

export class HistoryListItem extends Component{

    onVideoSelect = () =>{
        const {video, resultDetail} = this.props;
        this.props.startSelectVideo({
            searchKey: video.searchKey,
            updatedHitSelect: (resultDetail[video.engine][video.searchKey] && 
                                resultDetail[video.engine][video.searchKey].hits) || [],
            video: [video],
            viewedAt: moment().utc().toISOString(),
            isSaved: video.isSaved,
            reRender: false,
            didMount: false
        })
        history.push('/');

    }

    updateIsSavedStatus= (result) =>{
        const dbIds = [];
        const updatedVideos = this.props.visitedVideos.map(video =>{
            if(video.id===this.props.video.id){
                video.isSaved = result.isSaved;
                dbIds.push(video.DB_id);
            }
            return video;
        });
        this.props.startSaveVideo({
            isSaved: result.isSaved,
            updatedVideos,
            dbIds
        });
    }

    onVideoSave=(e)=>{
        e.stopPropagation();
        let isSavedStatus = false;
        if($(e.target).text() === "star_border"){
            $(e.target).text("star");
            isSavedStatus = true;
            this.props.addFavCount({
                count: this.props.count + 1,
                videoId: this.props.video.id,
                ids: this.props.ids
            });
        } else{
            $(e.target).text("star_border");
            const index = this.props.ids.findIndex(idElement=> idElement.videoId===this.props.video.id);
            const count = (index>-1) ? this.props.count - 1 : this.props.count;
            if (index > -1){ 
                this.props.removeFavCount({
                    count,
                    videoIds: this.props.ids.filter(idElement => idElement.videoId !== this.props.video.id),
                    foundDbId: this.props.ids[index].DB_id
                })
            };
        }
        this.updateIsSavedStatus({isSaved: isSavedStatus});
    }

    render(){
        const {video} = this.props;
        const imageUrl = video.snippet && video.snippet.thumbnails.medium.url || video.DB_id;
        
        return(
            
            (!video.snippet)? (
                <li className="collection-item avatar HLI-1 ">
                    <div className="row">
                        <div className="col s12">
                            MISSING VIDEO
                        </div>
                    </div>
                </li>
            ) : (
                <li className="collection-item avatar HLI-1 ">
                    <div className="row" onClick={()=>this.onVideoSelect()}>
                        <div className="col s12 m12 l3 xl2 div-record-1">
                            <div>
                                <span className="span-search-text">Search term: </span>
                                <span> {video.searchKey}</span>
                            </div>
                            <div>
                                <span className="span-search-text">Last Visited Time:</span>
                                <span> {moment(video.viewedAt).local().format('ddd, MMM D YYYY')}</span>
                                <span> {moment(video.viewedAt).local().format('h:mm:ss a')}</span>                    
                            </div>
                        </div>
                        <div className="col s12 m3 l3 xl3 div-record-2">
                            <img src={imageUrl} className="responsive-img"/>
                        </div>
                        <div className="col s11 m8 l5 xl6 div-record-3">
                            <span className="title">{video.snippet.title}</span>
                            <p>{moment(video.snippet.publishedAt).format('DD MMM YYYY')} - {video.statistics.viewCount} views<br />
                                Uploaded by:<a href={`http://www.youtube.com/channel/${video.snippet.channelId}`}> {video.snippet.channelTitle}</a>
                            </p>
                            <p>{video.snippet.description.substring(0,200)}...</p>                    
                        </div>
                        <div className="col s1 m1 l1 xl1 div-record-4">
                            <i className="material-icons" onClick={this.onVideoSave}>{(video.isSaved)?'star' : 'star_border'}</i> 
                        </div>
                    </div>
                </li>
            )
        )
    }
}

const mapStateToProps = (state)=>({
    visitedVideos: state.videos.visitedVideos,
    count: state.filters.unViewedFavCount,
    ids: state.filters.unViewedFavIds,
    isSearchByKey: state.filters.isSearchByKey
});

const mapDispatchToProps = (dispatch)=>({
    startSelectVideo: (video)=> dispatch(startSelectVideo(video)),
    startSaveVideo: (video)=> dispatch(startSaveVideo(video)),
    addFavCount: (favCount) => dispatch(addFavCount(favCount)),
    removeFavCount: (favCount) => dispatch(removeFavCount(favCount))
});

export default connect(mapStateToProps, mapDispatchToProps)(HistoryListItem);