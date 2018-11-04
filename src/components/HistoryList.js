import React from 'react';
import {connect} from 'react-redux';
import HistoryListItem from './HistoryListItem';
import videoHistory from '../selectors/videos';

//-- Note unique id for key is necessary to output the correct number of filtered videos!
export const HistoryList = (props) => {
    const filteredVids = props.displayVideos;
    console.log('Begin History List');
    if(filteredVids.length===0) {
        return(
            <p>No videos in video history under selected filters</p>
        )
    } else{
        return (
            <div className="row">
            {
                (isSearchByKey) ? (
                    <div className="swiper-container">
                        <div className="swiper-wrapper">

                        </div> 
                    </div>
                ):
                    (
                        <div className="col s12">
                            <ul className="collection">
                                {
                                    filteredVids.map((video, index) =>(
                                        <HistoryListItem 
                                            {...props} 
                                            key={video.id+index} 
                                            video={video}
                                            resultDetail={props.resultDetail}
                                        />
                                    ))
                                }
                            </ul>
                        </div>
                    )
            }
            </div>
        )
}

const mapStateToProps = (state) => ({
    displayVideos: videoHistory(state.videos.visitedVideos, state.filters),
    resultDetail: state.videos.resultDetail,
    isSearchByKey: state.filters.isSearchByKey
});
  
export default connect(mapStateToProps)(HistoryList);