import React, {Component} from 'react';
import {connect} from 'react-redux';
import VideoListItem from './VideoListItem';
import LoadingPage from './LoadingPage';

class VideoListEngine extends Component {

    onChangePage=(e)=>{
        const clickedIcon = $(e.target).children('i').text();
        this.props.onChangePage(this.props.engine, clickedIcon);
    }

    render(){
        const {pageActive, lastPageReached, lastPageFound, nextPageToken, resultsPerPage} = this.props.page;
        const {error, engine, results, searchKey} = this.props;

        if(error){
            return <p>{error}</p>
        } else if(!results[engine] || !results[engine][searchKey] || results[engine][searchKey].hits.length===0){
            return (<LoadingPage />)
        }
        else{
            const startIndex = (pageActive[engine]-1)*resultsPerPage;
            const endIndex = Math.min(pageActive[engine]*resultsPerPage, results[engine][searchKey].hits.length);
            return(
                <div>
                    <ul className="list-nav">
                        <li onClick={this.onChangePage} className={(pageActive[engine]===1) ? "btn-flat disabled btn-small col s2" : "waves-effect waves-light btn-flat btn-small col s2"}><i className="material-icons">first_page</i></li>
                        <li onClick={this.onChangePage} className={(pageActive[engine]===1) ? "btn-flat disabled btn-small col s4" : "waves-effect waves-light btn-flat btn-small col s4"}>
                            <i className="material-icons left">chevron_left</i><span>Prev</span>
                        </li>
                        <li onClick={this.onChangePage} className={(nextPageToken[engine]==='' || lastPageReached[engine])? "btn-flat disabled btn-small col s4" : "waves-effect waves-light btn-flat btn-small col s4"}>
                            <i className="material-icons right">chevron_right</i><span>Next</span>
                        </li>
                        <li onClick={this.onChangePage} className={(!lastPageFound[engine] || lastPageReached[engine])? "btn-flat disabled btn-small col s2" : "waves-effect waves-light btn-flat btn-small col s2"}>
                            <i className="material-icons">last_page</i>
                        </li>
                    </ul>
                    <ul className="collection">
                        {
                            results[engine][searchKey].hits.slice(startIndex, endIndex).map(video=>(
                                <VideoListItem key={video.id.videoId} video={video} searchKey={searchKey} engine={engine} />
                            ))
                        }
                    </ul>
                </div>
            )
        }
    } 
};

const mapStateToProps = (state)=>({
    page: state.page,
    results: state.videos.results,
    searchKey: state.videos.searchKey
})

export default connect(mapStateToProps)(VideoListEngine);