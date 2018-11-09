import _ from 'lodash';
import React, {Component} from 'react';
import {connect} from 'react-redux';
import FavoriteListItem from './FavoriteListItem';
import HistoryListItem from './HistoryListItem';
import FavoriteModal from './FavoriteModal';
import favorites from '../selectors/favorites';
import {videoHistory} from '../selectors/videos';
import {setSearchKeyFilter, clearSearchKeyFilter} from '../actions/filters';
import SideNav from './SideNav';

export class FavoriteList extends Component {

    state ={
        showModal: false,
        clickedVideo: {}
    }

    onClickedKey = (e)=>{
        console.log($(e.target).text());
        this.props.setSearchKeyFilter($(e.target).text());
    };

    onClearKeys= ()=>{
        this.props.clearSearchKeyFilter();
    };

    handleOpenModal= (clickedVideo)=>{
        this.setState({
            showModal: true,
            clickedVideo
        });
    }

    handleCloseModal=()=>{
        this.setState({showModal: false});
    }

    render(){
        const filteredVids = (this.props.listType === 'favorites')? this.props.uniqueLikedVideos : this.props.displayVideos;
        const searchKeyObj = _.groupBy(filteredVids, vid=>vid.searchKey);
        let filteredList, fullList;
        if(this.props.listType === 'favorites'){
            filteredList = (
                this.props.searchKeyFilter.map(term=>(
                    searchKeyObj[term].map((video, index) =>(
                        <FavoriteListItem 
                            handleOpenModal={this.handleOpenModal}
                            key={video.id+index} 
                            video={video}
                        />
                    ))
                ))
            );
            fullList = (
                filteredVids.map((video, index) =>(
                    <FavoriteListItem 
                        handleOpenModal={this.handleOpenModal}
                        key={video.id+index} 
                        video={video}
                    />
                ))
            )
        } else{
            filteredList = (
                this.props.searchKeyFilter.map(term=>(
                    searchKeyObj[term].map((video, index) =>(
                        <HistoryListItem 
                            key={video.id+index} 
                            video={video}
                            resultDetail={this.props.resultDetail}
                        />
                    ))
                ))
            );
            fullList = (
                filteredVids.map((video, index) =>(
                        <HistoryListItem 
                            key={video.id+index} 
                            video={video}
                            resultDetail={this.props.resultDetail}
                        />
                ))
            );
        }

        return(
                <div className="row">
                    <SideNav 
                        searchKeyObj={searchKeyObj} 
                        auth={this.props.auth}
                        onClickedKey={this.onClickedKey}
                        onClearKeys={this.onClearKeys}
                        searchKeyFilter={this.props.searchKeyFilter}
                    />
                    {
                        (filteredVids.length === 0) ? (
                            <p>No videos in {(this.props.listType === 'favorites')? 'favorites': 'video history'} under selected filters</p>
                        ):( 
                            <div className="col s12">
                                <ul className="collection">
                                {
                                    (this.props.searchKeyFilter.length>0) ? filteredList : fullList
                                }
                                </ul>
                            </div>
                        )
                    }
                    {(this.props.listType === 'favorites') ? (
                        <FavoriteModal
                            showModal={this.state.showModal}
                            handleCloseModal={this.handleCloseModal}
                            video={this.state.clickedVideo}
                        />) : ('')
                    }
                </div>
        )
    }
}

const mapStateToProps = (state) => ({
    auth: state.auth,
    visitedVideos: state.videos.visitedVideos,
    displayVideos: videoHistory(state.videos.visitedVideos, state.filters),
    uniqueLikedVideos: favorites(state.videos.visitedVideos),
    searchKeyFilter: state.filters.searchKeyFilter
});

const mapDispatchToProps = (dispatch)=>({
    setSearchKeyFilter: (text)=> dispatch(setSearchKeyFilter(text)),
    clearSearchKeyFilter: ()=> dispatch(clearSearchKeyFilter())
});

export default connect(mapStateToProps, mapDispatchToProps)(FavoriteList);