import React, {Component} from 'react';
import VideoListEngine from './VideoListEngine';
import {playerLabelsObj} from '../fixtures/playerLabels';

export class VideoList extends Component{
    
    componentDidUpdate(prevProps){
        if(this.props.video.engine !== prevProps.video.engine){
            const el = document.querySelector('.tabs');
            const instance = M.Tabs.getInstance(el);
            instance.select(this.props.video.engine);
        }
    }

    componentDidMount(){
        $('.tabs').tabs();
        $(`a[href='${this.props.video.engine}']`).on('click', ()=>{
            this.props.activateTab(this.props.video.engine);
        });
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
                        <ul className="tabs tabs-fixed-width">
                            {
                                Object.keys(playerChecked).map((key)=>(
                                    <li className={`tab col s3 ${(playerChecked[key])?'':'disabled'}`}>
                                        <a href={`#${key}`}>
                                            <img className="responsive-img" src={playerLabelsObj[key].img} />
                                            <span className="player-label">{playerLabelsObj[key].text}</span>
                                        </a>
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