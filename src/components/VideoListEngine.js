import React, {Component} from 'react';
import {connect} from 'react-redux';
import VideoListItem from './VideoListItem';
import LoadingPage from './LoadingPage';
import { setReRender } from '../actions/videos';

class VideoListEngine extends Component {

    onChangePage=(e)=>{
        e.stopPropagation();
        const clickedIcon = $(e.target).children('i').text() || $(e.target).text();
        this.props.setReRender(true);
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
                        <li>
                            <button onClick={this.onChangePage} 
                                className={(pageActive[engine]===1) ? 
                                    "btn-flat disabled btn-small col s2" : "waves-effect waves-light btn-flat btn-small col s2"}>
                                <i onClick={this.onChangePage} className="material-icons">first_page</i>
                            </button>    
                        </li>
                        
                        <li>
                            <button onClick={this.onChangePage} 
                                className={(pageActive[engine]===1) ?
                                    "btn-flat disabled btn-small col s4" : "waves-effect waves-light btn-flat btn-small col s4"}>
                                <i onClick={this.onChangePage} className="material-icons left">chevron_left</i>Prev
                            </button>
                        </li>
                        <li>
                            <button onClick={this.onChangePage} 
                                className={(nextPageToken[engine]==='' || lastPageReached[engine]) ?
                                    "btn-flat disabled btn-small col s4" : "waves-effect waves-light btn-flat btn-small col s4"}>
                                Next <i onClick={this.onChangePage} className="material-icons right">chevron_right</i>
                            </button>
                        </li>
                        <li>
                            <button onClick={this.onChangePage} 
                                className={(!lastPageFound[engine] || lastPageReached[engine]) ? 
                                    "btn-flat disabled btn-small col s2" : "waves-effect waves-light btn-flat btn-small col s2"}>
                                <i onClick={this.onChangePage} className="material-icons">last_page</i>
                            </button>
                        </li>
                    </ul>
                    <ul className="collection">
                        {
                            results[engine][searchKey].hits.slice(startIndex, endIndex).map(video=>(
                                <VideoListItem key={video.id.videoId || video.id} 
                                            video={video} 
                                            searchKey={searchKey} engine={engine} />
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

const mapDispatchToProps = (dispatch)=>({
    setReRender : (isReRender) => dispatch(setReRender(isReRender))
})
export default connect(mapStateToProps, mapDispatchToProps)(VideoListEngine);