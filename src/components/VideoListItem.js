import React, {Component} from "react";
import {connect} from 'react-redux';
import moment from "moment";
import {startSelectVideo} from "../actions/videos";
import {indVidAPISearch} from './APISearch';
import {videoListObj} from '../fixtures/vidFieldNorm';

export class VideoListItem extends Component{

    onVideoSelect = async () =>{
        const {video, resultDetail, searchKey, engine} = this.props;
        const videoClicked = await indVidAPISearch(video, engine);
        const updatedHitSelect = [...resultDetail[engine][searchKey].hits, ...videoClicked];
        this.props.startSelectVideo({
            searchKey,
            updatedHitSelect,
            video:videoClicked,
            viewedAt: moment().utc().toISOString(),
            engine
        });
    }

    render(){
        const video = videoListObj(this.props.video, this.props.engine);
        
        return(
            <li class="VLI-1 collection-item avatar">
                <div className="row valign-wrapper list-spacing" onClick={()=>this.onVideoSelect()}>
                    <div className="col s4">
                        <img src={video.imageUrl} className="responsive-img"/>
                    </div>
                    <div className="col s8 list-items">
                        <span className="list-title">{video.title}</span>
                        <p>{moment(video.publishedAt).format('DD MMM YYYY')}<br />
                        Uploaded by:<a href={video.channelUrl}> {video.channelTitle}</a></p>
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