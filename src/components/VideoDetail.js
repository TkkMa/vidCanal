import React, {Component} from 'react';
import {connect} from 'react-redux';
import moment from 'moment';
import {startSaveVideo} from '../actions/videos';
import {addFavCount, removeFavCount} from '../actions/filters';
import {videoDetailObj} from '../selectors/videos';
import {playerLabelsObj} from '../fixtures/playerLabels';
import LoadingPage from './LoadingPage';

// import updateIsSavedStatus from '../selectors/updateIsSavedStatus';

class VideoDetail extends Component {

    // updateIsSavedStatus - called when (1) video is liked and (2) a clicked video that was previously
    // visited and liked.  componentDidUpdate is used to handle (2)
    updateIsSavedStatus= (result) =>{
        const dbIds = [];
        const updatedVideos = this.props.visitedVideos.map(video =>{
            if(video.id===this.props.video.id){
                video.isSaved = result.isSaved;
                dbIds.push(video.DB_id);
            }
            return video;
        });
        //-- after the following dispatch, componentDidUpdate lifecycle method is called
        this.props.startSaveVideo({
            isSaved: result.isSaved,
            updatedVideos,
            dbIds
        });
    }

    componentDidMount(){
        $('.collapsible').collapsible();
    }

    componentDidUpdate(prevProps){
        // console.log('componentDidUpdate in VideoDetail initialised!');
        // const {embedURL} = videoDetailObj(this.props.video);
        // $("iframe").removeAttr('src').attr('src', embedURL);

        if(this.props.video.id !== prevProps.video.id){
            //-- Find isSaved state of the most recent re-visited video
            const prevVid = this.props.visitedVideos
                                .slice(0,this.props.visitedVideos.length-1)
                                .reverse()
                                .find(video =>video.id===this.props.video.id)
            //-- Update the previous isSaved state to all visited videos       
            if(prevVid && prevVid.isSaved !== this.props.video.isSaved){
                console.log('Call update is Saved Status');
                this.updateIsSavedStatus(prevVid);
            }
        }
    }

    onVideoSave=(e)=>{
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
            this.props.removeFavCount({
                count,
                videoIds: this.props.ids.filter(idElement => idElement.videoId !== this.props.video.id),
                foundDbId: this.props.ids[index].DB_id
            });
        }
        this.updateIsSavedStatus({isSaved: isSavedStatus})
    }

    blockSave = (e)=>{
        e.preventDefault();
        alert('Please log in to save video!');
    }

    render(){
        const {isAuthenticated} =this.props;
        const video = videoDetailObj(this.props.video);

        return (
            (!video) ? (
                <div className="col s12 m12 l7 xl8">
                    <LoadingPage />
                </div>
            ) :
            (
                <div className="col s12 m12 l7 xl8">
                    <div className="video-container">
                        <iframe width="853" height="480" frameBorder="0" src={video.embedURL} allowFullScreen="allowFullScreen" />
                    </div>
                    <div className="VD-1 card-panel grey lighten-5">
                        <div className="row valign-wrapper">
                            <div className="col s2 m1 l2 xl1">
                                <img className="logo responsive-img" src={playerLabelsObj[video.engine].img} />
                            </div>
                            <div className="col s7 m8 l7 xl8">
                                <div className="pubDate">Published on: {moment(video.publishedAt).format('DD MMM YYYY')} by  
                                    <a href={video.channelUrl}> {video.channelTitle}</a>
                                </div>
                            </div>
                            <div className="col s2 m2 l2 xl2">
                                <div className="views">{video.viewCount} views</div> 
                            </div>
                            <div className="col s1 m1 l1 xl1">
                                <i className="starBorder material-icons" 
                                    onClick={(isAuthenticated) ? this.onVideoSave : this.blockSave}
                                >
                                    {video.isSaved ? 'star': 'star_border'}
                                </i> 
                            </div>
                        </div>
                        <ul className="row collapsible">
                            <li className= "col s12">
                                <div className="title collapsible-header">
                                    <span>{video.title}</span>
                                    <button className="btn btn-small"><i className="material-icons">description</i></button>
                                </div>
                                <div className="description collapsible-body" dangerouslySetInnerHTML={{__html: video.description.replace(/\n/g, "<br>")}}></div>
                            </li>
                        </ul>
                    </div>
                </div>
            )
        )
    }
}

const mapStateToProps = (state)=>({
    visitedVideos: state.videos.visitedVideos,
    count: state.filters.unViewedFavCount,
    ids: state.filters.unViewedFavIds,
    isAuthenticated : !!state.auth.uid
});

const mapDispatchToProps = (dispatch)=>({
    startSaveVideo: (video) => dispatch(startSaveVideo(video)),
    addFavCount: (favCount) => dispatch(addFavCount(favCount)),
    removeFavCount: (favCount) => dispatch(removeFavCount(favCount))
});

export default connect(mapStateToProps, mapDispatchToProps)(VideoDetail);