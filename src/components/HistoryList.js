import _ from 'lodash';
import React, {Component} from 'react';
import {connect} from 'react-redux';
import HistoryListItem from './HistoryListItem';
import {videoHistory} from '../selectors/videos';
import {setSearchKeyFilter} from '../actions/filters';
import SideNav from './SideNav';

//-- Note unique id for key is necessary to output the correct number of filtered videos!
export class HistoryList extends Component {

    onClickedKey = (e)=>{
        console.log($(e.target).text());
        this.props.setSearchKeyFilter($(e.target).text());
    };

    render(){
        const filteredVids = this.props.displayVideos;
        const searchKeyObj = _.groupBy(filteredVids, vid=>vid.searchKey);

        console.log('Begin History List');
            return(
                <div className="row">
                    <SideNav 
                        searchKeyObj={searchKeyObj} 
                        auth={this.props.auth}
                        onClickedKey={this.onClickedKey}
                    />
                    {
                        (filteredVids.length===0) ? (
                            <p>No videos in video history under selected filters</p>
                        ) :(
                                <div className="col s12">
                                    <ul className="collection">
                                    {
                                        (this.props.searchKeyFilter) ? (
                                            searchKeyObj[this.props.searchKeyFilter].map((video, index) =>(
                                                <li className="collection-item avatar HLI-1 ">
                                                    <HistoryListItem 
                                                        {...this.props} 
                                                        key={video.id+index} 
                                                        video={video}
                                                        resultDetail={this.props.resultDetail}
                                                    />
                                                </li>
                                            ))
                                        ):
                                        (
                                            filteredVids.map((video, index) =>(
                                                <li className="collection-item avatar HLI-1 ">
                                                    <HistoryListItem 
                                                        {...this.props} 
                                                        key={video.id+index} 
                                                        video={video}
                                                        resultDetail={this.props.resultDetail}
                                                    />
                                                </li>
                                            ))
                                        )
                                    }
                                    </ul>
                                </div>
                        )
                    }
                </div>
            )           
    }
}

const mapStateToProps = (state) => ({
    auth: state.auth,
    displayVideos: videoHistory(state.videos.visitedVideos, state.filters),
    resultDetail: state.videos.resultDetail,
    searchKeyFilter: state.filters.searchKeyFilter
});
  
const mapDispatchToProps = (dispatch)=>({
    setSearchKeyFilter: (text)=> dispatch(setSearchKeyFilter(text))
});

export default connect(mapStateToProps, mapDispatchToProps)(HistoryList);