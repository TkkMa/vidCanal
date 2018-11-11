import React, {Component} from 'react';
import { connect } from 'react-redux';
import VideoListItem from './VideoListItem';
import LoadingPage from './LoadingPage';

export class VideoList extends Component{
    
    componentDidMount(){
        $('.tabs').tabs();
    }
    
    onChangePage=(e)=>{
        const clickedIcon = $(e.target).children('i').text();
        this.props.onPageChange(undefined, clickedIcon);
    }

    render(){
        const {results, searchKey, pageToken, pageActive, lastPageReached, lastPageFound, numResults, error} = this.props;

        if(error){
            return <p>{error}</p>
        } else if(!results || !results[searchKey] || results[searchKey].hits.length===0){
            return (
                <div className="VL-1 col s12 m12 l5 xl4">
                    <LoadingPage />
                </div>
            )
        } else {
            const startIndex = (pageActive-1)*numResults;
            const endIndex = Math.min(pageActive*numResults, results[searchKey].hits.length);
            return(
                <div className="VL-1 col s12 m12 l5 xl4">
                    <div class="row">
                        <ul className="list-nav">
                            <li onClick={this.onChangePage} className={(pageActive===1) ? "btn-flat disabled btn-small col s2" : "waves-effect waves-light btn-flat btn-small col s2"}><i className="material-icons">first_page</i></li>
                            <li onClick={this.onChangePage} className={(pageActive===1) ? "btn-flat disabled btn-small col s4" : "waves-effect waves-light btn-flat btn-small col s4"}>
                                <i className="material-icons left">chevron_left</i><span>Prev</span>
                            </li>
                            <li onClick={this.onChangePage} className={(pageToken==='' || lastPageReached)? "btn-flat disabled btn-small col s4" : "waves-effect waves-light btn-flat btn-small col s4"}>
                                <i className="material-icons right">chevron_right</i><span>Next</span>
                            </li>
                            <li onClick={this.onChangePage} className={(!lastPageFound || lastPageReached)? "btn-flat disabled btn-small col s2" : "waves-effect waves-light btn-flat btn-small col s2"}>
                                <i className="material-icons">last_page</i>
                            </li>
                        </ul>
                    </div>
                    <div className="row">
                        <div className="col s12">
                        <ul className="tabs">
                            <li className="tab col s3"><a className="active" href="#test1">Youtube</a></li>
                            <li className="tab col s3"><a href="#test2">Vimeo</a></li>
                            <li className="tab col s3"><a href="#test3">Dailymotion</a></li>
                        </ul>
                        </div>
                        <div id="test1" className="col s12">Youtube</div>
                        <div id="test2" className="col s12">Vimeo</div>
                        <div id="test3" className="col s12">Dailymotion</div>
                    </div>
                    <ul className="collection">
                        {
                            results[searchKey].hits.slice(startIndex, endIndex).map((video)=>{
                                return (
                                    <VideoListItem key={video.id.videoId} video={video} searchKey={searchKey} />
                                )
                            })
                        }
                    </ul> 
                </div>
            )
        }
    }
}

const mapStateToProps = (state)=>({
    searchKey: state.videos.searchKey,
    results: state.videos.results
});

export default connect(mapStateToProps)(VideoList);