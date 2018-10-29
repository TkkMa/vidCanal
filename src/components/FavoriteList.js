import React, {Component} from 'react';
import {connect} from 'react-redux';
import FavoriteListItem from './FavoriteListItem';
import FavoriteModal from './FavoriteModal';
import favorites from '../selectors/favorites';
// import {setFavCount} from '../actions/filters';

export class FavoriteList extends Component {

    state ={
        showModal: false,
        clickedVideo: {}
    }

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
        return(
                <div className="row">
                    {
                        (filteredVids.length === 0) ? (
                            <p>No favorite videos</p>
                        ):(
                            <div className="col s12">
                                <ul className="collection">
                                    {
                                        filteredVids.map((video, index) =>(
                                            <FavoriteListItem 
                                                {...this.props} 
                                                handleOpenModal={this.handleOpenModal}
                                                key={video.id+index} 
                                                video={video}
                                            />
                                        ))
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

const mapStateToProps = (state) => {
    return {
      visitedVideos: state.videos.visitedVideos,
      uniqueLikedVideos: favorites(state.videos.visitedVideos)
    };
};

export default connect(mapStateToProps)(FavoriteList);