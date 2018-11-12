import React, {Component} from 'react';
import VideoListEngine from './VideoListEngine';

export class VideoList extends Component{
    
    componentDidMount(){
        $('.tabs').tabs();
    }
    
    onChangePage=(selectedEngine, clickedIcon)=>{
        this.props.onPageChange(undefined, selectedEngine, clickedIcon);
    }

    render(){
        return(
            <div className="VL-1 col s12 m12 l5 xl4">
                <div className="row">
                    <div className="col s12">
                        <ul className="tabs">
                            <li className="tab col s3"><a className="active" href="#YT">Youtube</a></li>
                            <li className="tab col s3"><a href="#V">Vimeo</a></li>
                            <li className="tab col s3"><a href="#D">Dailymotion</a></li>
                        </ul>
                    </div>
                    <div id="YT" className="col s12">
                        <VideoListEngine 
                            error={this.props.error}
                            onChangePage={this.onChangePage} 
                            engine='YT'
                        />
                    </div>
                    <div id="V" className="col s12">
                        <VideoListEngine 
                            error={this.props.error}
                            onChangePage={this.onChangePage}  
                            engine='V'
                        />                        
                    </div>
                    <div id="D" className="col s12">
                        <VideoListEngine 
                            error={this.props.error}
                            onChangePage={this.onChangePage}  
                            engine='D'
                        />                           
                    </div>
                </div>
            </div>
        )
    }
}

export default VideoList;