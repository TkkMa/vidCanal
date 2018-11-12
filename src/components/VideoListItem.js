import React, {Component} from "react";
import {connect} from 'react-redux';
import moment from "moment";
import {startSelectVideo} from "../actions/videos";
import {indVidAPISearch} from './APISearch';

export class VideoListItem extends Component{

    onVideoSelect = async () =>{
        const {video, resultDetail, searchKey, engine} = this.props;
        const videoClicked = await indVidAPISearch({id:video.id.videoId}, engine);
        const updatedHitSelect = [...resultDetail[engine][searchKey].hits, ...videoClicked];
        this.props.startSelectVideo({
            searchKey,
            updatedHitSelect,
            video:videoClicked,
            viewedAt: moment().utc().toISOString()
        });
    }

    render(){
        const imageUrl = this.props.video.snippet.thumbnails.default.url;
        return(
            <li class="VLI-1 collection-item avatar">
                <div className="row valign-wrapper list-spacing" onClick={()=>this.onVideoSelect()}>
                    <div className="col s4">
                        <img src={imageUrl} className="responsive-img"/>
                    </div>
                    <div className="col s8 list-items">
                        <span className="list-title">{this.props.video.snippet.title}</span>
                        <p>{moment(this.props.video.snippet.publishedAt).format('DD MMM YYYY')}<br />
                        Uploaded by:<a href={`http://www.youtube.com/channel/${this.props.video.snippet.channelId}`}> {this.props.video.snippet.channelTitle}</a></p>
                    </div>
                </div>
            </li>
        )
    }
}

const mapStateToProps = (state)=>({
    resultDetail: state.videos.resultDetail
})

const mapDispatchToProps = (dispatch)=>({
    startSelectVideo: (video)=> dispatch(startSelectVideo(video))
});

export default connect(mapStateToProps, mapDispatchToProps)(VideoListItem);