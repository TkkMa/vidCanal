import React, {Component} from 'react';
import {connect} from 'react-redux';
import favorites from '../selectors/favorites';
import {startSaveVideo} from '../actions/videos';
import {clearFavCount} from '../actions/filters';
import DeletionModal from './DeletionModal';

class FavoriteListFilters extends Component{

    state ={
        showModal: false,
        message: 'favorite videos'
    };

    componentDidMount(){
        $(".dropdown-trigger").dropdown();
        $('.sidenav').sidenav({
            preventScrolling: false
        });
    };

    handleCloseModal = () =>{
        this.setState({showModal: false});
    };

    handleOpenModal = () =>{
        if (this.props.uniqueLikedVids.length) {this.setState({showModal: true});}
    };
    
    clearFavorites=()=>{
        const dbIds = [];
        const updatedVideos = this.props.visitedVideos.map(video =>{
            if(video.isSaved===true){
                video.isSaved = false
                dbIds.push(video.DB_id);
            }
            return video;
        })
        this.props.startSaveVideo({
            dbIds,
            updatedVideos
        })
        this.props.setFavCount({
            count: 0,
            countIds : []
        });
        this.handleCloseModal();                 
    };

    markAsSeen=()=>{
        this.props.clearFavCount();
    };

    render(){
        return(
            <div>
                <ul id="dropdown1" className="dropdown-content">
                    <li onClick={this.markAsSeen}><a><i className="material-icons">remove_red_eye</i>Seen All</a></li>
                    <li onClick={this.handleOpenModal}><a><i className="material-icons">clear_all</i>Clear</a></li>
                </ul>
                <nav className="FLF-1">
                    <div className="nav-wrapper row">
                        <div className="col s5 m4 l3 xl2 right">
                            <a class="dropdown-trigger" href="#!" data-target="dropdown1"><i class="material-icons left">edit</i>Actions<i class="material-icons right">arrow_drop_down</i></a>
                        </div>
                        <div className="col s1 m1 right">
                            <i className="material-icons">star</i>{this.props.uniqueLikedVids.length}
                        </div>
                        <div className="col s2 m1 l1 xl1 right">
                            <button data-target="slide-out" className="sidenav-trigger btn btn-flat">
                                <i className="material-icons">list</i>
                                {(this.props.searchKeyFilter.length)? <i className="material-icons">check_circle</i>: <i/>}
                            </button>
                        </div>
                    </div>
                </nav>
                <DeletionModal
                    showModal={this.state.showModal}
                    handleCloseModal={this.handleCloseModal}
                    clearList={this.clearFavorites}
                    message={this.state.message}
                />
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    searchKeyFilter: state.filters.searchKeyFilter,
    uniqueLikedVids: favorites(state.videos.visitedVideos),
    visitedVideos: state.videos.visitedVideos
});

const mapDispatchToProps = (dispatch)=>({
    startSaveVideo: (video) => dispatch(startSaveVideo(video)),
    clearFavCount: () => dispatch(clearFavCount())
});

export default connect(mapStateToProps, mapDispatchToProps)(FavoriteListFilters);