import React, {Component} from 'react';
import VideoListEngine from './VideoListEngine';

export class VideoList extends Component{
    
    state={
        YT: 'Youtube',
        V: 'Vimeo',
        D: 'Dailymotion'
    }

    componentDidMount(){
        $('.tabs').tabs();
    }
    
    onChangePage=(selectedEngine, clickedIcon)=>{
        this.props.onPageChange(undefined, selectedEngine, clickedIcon);
    }

    render(){
        const {playerChecked} = this.props;
        return(
            <div className="VL-1 col s12 m12 l5 xl4">
                <div className="row">
                    <div className="col s12">
                        <ul className="tabs">
                            {
                                Object.keys(playerChecked).map((key)=>(
                                    <li className={`tab col s3 ${(playerChecked[key])?'':'disabled'}`}>
                                        <a href={`#${key}`}>{this.state[key]}</a>
                                    </li>
                                ))
                            }
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