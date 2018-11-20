import React, {Component} from 'react';
import VideoListEngine from './VideoListEngine';
import {playerLabelsObj} from '../fixtures/playerLabels';
import LoadingPage from './LoadingPage';

export class VideoList extends Component{
    
    componentDidUpdate(prevProps){
        if(this.props.activeTab !== prevProps.activeTab){
            const el = document.querySelector('.tabs');
            const instance = M.Tabs.getInstance(el);
            instance.select(this.props.activeTab);
        }
    }

    componentDidMount(){
        $('.tabs').tabs();
        // Apply vendor jQuery plugin to detect active class
        const {onTabChange} = this.props;
        $(".player-tab").each(function(index,element){
            $(this).on('click', function(){
                if(!$(this).hasClass('disabled')){
                    let engine = $(element).attr('href').slice(1);
                    onTabChange(engine);
                }
            })
        })
    }
    
    onChangePage=(selectedEngine, clickedIcon)=>{
        this.props.onPageChange(undefined, selectedEngine, clickedIcon);
    }

    render(){

        const {playerChecked, video, error} = this.props;
        if(!video && !error){
            return (
                <div className="VL-1 col s12 m12 l5 xl4"><LoadingPage /></div>
            )
        } else {
            return(
                <div className="VL-1 col s12 m12 l5 xl4">
                    <div className="row">
                        <div className="col s12">
                            <ul className="tabs tabs-fixed-width">
                                {
                                    Object.keys(playerChecked).map((key)=>(
                                        <li className={`tab col s3 ${(playerChecked[key])?'':'disabled'}`}>
                                            <a className={`player-tab ${(playerChecked[key])?'':'disabled'}`} href={`#${key}`}>
                                                <img className="responsive-img" src={playerLabelsObj[key].img} />
                                                <span className="player-label">{playerLabelsObj[key].text}</span>
                                            </a>
                                        </li>
                                    ))
                                }
                            </ul>
                        </div>
                        {
                            (error) ? (
                                <div className="col s12">{error}</div>
                            ) : (
                                <div>
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
                            )
                        }
                    </div>
                </div>
            )
        }
    }
}

export default VideoList;