import React, {Component} from "react";
import {connect} from 'react-redux';
import moment from "moment";
import {selectVideo, startSaveVideo} from "../actions/videos";
import {removeFavCount} from '../actions/filters';

export class FavoriteListItem extends Component{

    state = {
        height: "150px"
    }

    updateCountData = () =>{
        const index = this.props.ids.findIndex(idElement=> idElement.videoId===this.props.video.id);
        const count = (index>-1) ? this.props.count - 1 : this.props.count;
        this.props.removeFavCount({
            count,
            videoIds: this.props.ids.filter(idElement => idElement.videoId !== this.props.video.id),
            foundDbId: this.props.ids[index].DB_id
        });
    }

    handleOpenModal = () =>{
        this.updateCountData();
        this.props.handleOpenModal(this.props.video)
    }

    clearItem =(e)=>{
        e.stopPropagation();
        this.updateCountData();
        const updatedVideos = this.props.visitedVideos.map(video=>{
            if (video.id === this.props.video.id){
                return {...video, isSaved:false}
            }
            return {...video};
        })
        this.props.startSaveVideo({
            updatedVideos,
            dbIds: [this.props.video.DB_id]
        })
    }

    render(){
        const {video} = this.props;
        const imageUrl = video.snippet.thumbnails.medium.url;
        return(
            <li className="collection-item avatar FLI-1" onClick={this.handleOpenModal}>
                <div className="row">
                    <div className="col s12 m12 l3 xl2 div-record-1">
                        <div>
                            <span className="span-search-text">Search term: </span>
                                {video.searchKey}
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
                        <span className="title">
                            {video.snippet.title}
                            {(this.props.ids.findIndex(idElement=>idElement.videoId===video.id)>-1) ? <span className="new badge"></span>: <span/>}
                        </span>
                        <p>{moment(video.snippet.publishedAt).format('DD MMM YYYY')} - {video.statistics.viewCount} views<br />
                            Uploaded by:<a href={`http://www.youtube.com/channel/${video.snippet.channelId}`}> {video.snippet.channelTitle}</a>
                        </p>
                        <p>{video.snippet.description.substring(0,200)}...</p>                    
                    </div>
                    <div className="col s1 m1 l1 xl1 div-record-4">
                        <i className="material-icons right" onClick={this.clearItem}>clear</i>
                    </div>
                </div>
            </li>
        )
    }
}
const mapStateToProps = (state)=>({
    count: state.filters.unViewedFavCount,
    ids: state.filters.unViewedFavIds,
    visitedVideos: state.videos.visitedVideos
})

const mapDispatchToProps = (dispatch)=>({
    selectVideo: (video)=> dispatch(selectVideo(video)),
    removeFavCount: (favCount) => dispatch(removeFavCount(favCount)),
    startSaveVideo: (video) => dispatch(startSaveVideo(video))
});

export default connect(mapStateToProps, mapDispatchToProps)(FavoriteListItem);