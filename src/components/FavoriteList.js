import React, {Component} from 'react';
import {connect} from 'react-redux';
import FavoriteListItem from './FavoriteListItem';
import FavoriteModal from './FavoriteModal';
import favorites from '../selectors/favorites';
import {setSearchKeyFilter} from '../actions/filters';
import SideNav from './SideNav';

export class FavoriteList extends Component {

    state ={
        showModal: false,
        clickedVideo: {}
    }

    onClickedKey = (e)=>{
        console.log($(e.target).text());
        this.props.setSearchKeyFilter($(e.target).text());
        // this.setState({searchKey: $(e.target).text()});
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
        const filteredVids = this.props.uniqueLikedVideos;
        const searchKeyObj = _.groupBy(filteredVids, vid=>vid.searchKey);
        return(
                <div className="row">
                    <SideNav 
                        searchKeyObj={searchKeyObj} 
                        auth={this.props.auth}
                        onClickedKey={this.onClickedKey}
                    />
                    {
                        (filteredVids.length === 0) ? (
                            <p>No favorite videos</p>
                        ):( 
                            <div className="col s12">
                                <ul className="collection">
                                {
                                    (this.props.searchKeyFilter) ? (
                                        searchKeyObj[this.props.searchKeyFilter].map((video, index) =>(
                                            <FavoriteListItem 
                                                {...this.props} 
                                                handleOpenModal={this.handleOpenModal}
                                                key={video.id+index} 
                                                video={video}
                                            />
                                        ))
                                    ):
                                    (
                                    filteredVids.map((video, index) =>(
                                        <FavoriteListItem 
                                            {...this.props} 
                                            handleOpenModal={this.handleOpenModal}
                                            key={video.id+index} 
                                            video={video}
                                        />
                                    ))
                                    )
                                }
                                </ul>
                            </div>
                        )
                    }
                    <FavoriteModal
                        showModal={this.state.showModal}
                        handleCloseModal={this.handleCloseModal}
                        video={this.state.clickedVideo}
                    />
                </div>
        )
    }
}

const mapStateToProps = (state) => ({
    auth: state.auth,
    visitedVideos: state.videos.visitedVideos,
    uniqueLikedVideos: favorites(state.videos.visitedVideos),
    searchKeyFilter: state.filters.searchKeyFilter
});

const mapDispatchToProps = (dispatch)=>({
    setSearchKeyFilter: (text)=> dispatch(setSearchKeyFilter(text))
});

export default connect(mapStateToProps, mapDispatchToProps)(FavoriteList);