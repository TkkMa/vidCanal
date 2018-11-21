import React, {Component} from 'react';
import VideoListEngine from './VideoListEngine';
import {playerLabelsObj} from '../fixtures/playerLabels';
import LoadingPage from './LoadingPage';

export class VideoList extends Component{
    
    componentDidUpdate(prevProps){
        if(this.props.activeTab !== prevProps.activeTab){
            $('.tabs').tabs('select', this.props.activeTab);
        }
    }

    componentDidMount(){
        //-- Invoke tab change when tab is clicked by user
        const {onTabChange} = this.props;
        $(".player-tab").each(function(index,element){
            $(this).on('click', function(event){
                event.preventDefault();
                if(!$(this).hasClass('disabled')){
                    let engine = $(element).attr('href').slice(1);
                    onTabChange(engine);
                }
            })
        });

        //-- Check that ul tabs exists in DOM then execute select method
        this.checkTabExists(this.props.activeTab).then(function(activeTab){
            $('ul.tabs').tabs('select', activeTab);  
        });
    }
    
    checkTabExists = (activeTab)=> {
        return new Promise((resolve)=>{
            var checkExists = setInterval(activeTab=>{
                if ($('ul.tabs').length){
                    $('ul.tabs').tabs();
                    clearInterval(checkExists); // clears 100ms monitoring loop
                    resolve(activeTab);
                }
            },100);
        });
    };

    onChangePage=(selectedEngine, clickedIcon)=>{
        this.props.onPageChange(undefined, selectedEngine, clickedIcon);
    }

    render(){

        const {playerChecked, video, error, resultsPerPage} = this.props;

        if(error){
            return(
                <div className="VL-1 col s12 m12 l5 xl4">{error}</div>
            )
        }
        else if(!video){
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
                                            resultsPerPage={resultsPerPage}
                                        />
                                    </div>
                                    <div id="V" className="col s12">
                                        <VideoListEngine 
                                            error={this.props.error}
                                            onChangePage={this.onChangePage}  
                                            engine='V'
                                            resultsPerPage={resultsPerPage}
                                        />                        
                                    </div>
                                    <div id="D" className="col s12">
                                        <VideoListEngine 
                                            error={this.props.error}
                                            onChangePage={this.onChangePage}  
                                            engine='D'
                                            resultsPerPage={resultsPerPage}
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