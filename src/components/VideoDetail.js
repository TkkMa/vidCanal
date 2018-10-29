import React, {Component} from 'react';
import {connect} from 'react-redux';
import moment from 'moment';
import {startSaveVideo} from '../actions/videos';
import {setFavCount} from '../actions/filters';
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
        })
        //-- after the following dispatch, componentDidUpdate lifecycle method is called
        this.props.startSaveVideo({
            isSaved: result.isSaved,
            updatedVideos,
            dbIds
        })
    }

    componentDidUpdate(prevProps){
        console.log('componentDidUpdate in VideoDetail initialised!');
        const url = `https://www.youtube.com/embed/${this.props.video.id}`;
        $("iframe").removeAttr('src').attr('src', url);
        if(this.props.video.id !== prevProps.video.id){
            console.log('Inside loop of different props');


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
            this.props.setFavCount({
                count: this.props.count + 1,
                countIds: this.props.countIds.concat(this.props.video.id)
            });
        } else{
            $(e.target).text("star_border");
            const count = (this.props.countIds.findIndex(id=> id===this.props.video.id)>-1) ? 
                                this.props.count - 1 : this.props.count; 
            this.props.setFavCount({
                count,
                countIds: this.props.countIds.filter(id => id !== this.props.video.id)
            });
        }
        this.updateIsSavedStatus({isSaved: isSavedStatus})
    }

    render(){
        const {video} =this.props;
        return (
            (!video) ? (<div>Loading...</div>) :
            (
                <div className="col s12 m8">
                    <div className="video-container">
                        <iframe width="853" height="480" frameBorder="0" allowFullScreen="allowFullScreen" />
                    </div>
                    <div className="card-panel grey lighten-5">
                        <div className="row valign-wrapper">
                            <div className="col s10">
                                <div className="pubDate">Published on: {moment(video.snippet.publishedAt).format('DD MMM YYYY')} by  
                                    <a href={`http://www.youtube.com/channel/${video.snippet.channelId}`}> {video.snippet.channelTitle}</a>
                                </div>
                            </div>
                            <div className="col s1">
                                <div className="views">{video.statistics.viewCount} views</div> 
                            </div>
                            <div className="col s1">
                                <i className="starBorder material-icons" onClick={this.onVideoSave}>
                                    {video.isSaved ? 'star': 'star_border'}
                                </i> 
                            </div>
                        </div>
                        <div className="row">
                            <div className= "col s12">
                                <div className="title">{video.snippet.title}</div>
                                <div className="description" dangerouslySetInnerHTML={{__html: video.snippet.description.replace(/\n/g, "<br>")}}></div>
                            </div>
                        </div>
                    </div>
                </div>
            )
        )
    }
}

const mapStateToProps = (state)=>{
    return{
        visitedVideos: state.videos.visitedVideos,
        count: state.filters.count,
        countIds: state.filters.countIds
    }   
};

const mapDispatchToProps = (dispatch)=>({
    startSaveVideo: (video) => dispatch(startSaveVideo(video)),
    setFavCount: (favCount) => dispatch(setFavCount(favCount))
});

export default connect(mapStateToProps, mapDispatchToProps)(VideoDetail);