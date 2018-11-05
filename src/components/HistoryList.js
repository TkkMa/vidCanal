import _ from 'lodash';
import React, {Component} from 'react';
import {connect} from 'react-redux';
import HistoryListItem from './HistoryListItem';
import {videoHistory} from '../selectors/videos';
import Swiper from 'react-id-swiper';

//-- Note unique id for key is necessary to output the correct number of filtered videos!
export class HistoryList extends Component {

    render(){
        const params={
            pagination: {
                el: '.swiper-pagination',
                type: 'fraction',
              },
              navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
              }
        };

        const filteredVids = this.props.displayVideos;
        console.log('Begin History List');
        if(this.props.isSearchByKey){
            return(
            _.mapValues(filteredVids,(videoArray)=>(
                            <Swiper {...params} >
                                {
                                    videoArray.map((video, index)=>{
                                        console.log(video);
                                    })
                                }
                            </Swiper>
                ))
            )
        } else{
            return(
                <div className="row">
                    <div className="col s12">
                        <ul className="collection">
                            {
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
                            }
                        </ul>
                    </div>
                </div>
            )           
        }
    }
}
        // if(filteredVids.length===0) {
        //     return(
        //         <p>No videos in video history under selected filters</p>
        //     )
        // } else{
//             return (
//                 <div className="row">
//                     <div className="col s12">
//                         {
//                             (this.props.isSearchByKey) ? (
//                                 <div>empty</div>
//                                 // _.mapValues(filteredVids, (videoArray)=>(
//                                     // <Swiper {...params}>
//                                     //     {
//                                     //         // videoArray.map((video, index)=> (
//                                     //             <HistoryListItem 
//                                     //                 {...this.props} 
//                                     //                 key={videoArray[0].id} 
//                                     //                 video={videoArray[0]}
//                                     //                 resultDetail={this.props.resultDetail}
//                                     //             />
//                                     //         // ))
//                                     //     }
//                                     // </Swiper>
//                                 // ))
//                             ):
//                             (
//                                 <ul className="collection">
//                                     {
//                                         filteredVids.map((video, index) =>(
//                                             <li className="collection-item avatar HLI-1 ">
//                                                 <HistoryListItem 
//                                                     {...this.props} 
//                                                     key={video.id+index} 
//                                                     video={video}
//                                                     resultDetail={this.props.resultDetail}
//                                                 />
//                                             </li>
//                                         ))
//                                     }
//                                 </ul>
//                             )
//                         }
//                     </div>
//                 </div>
//             )
//         }
//     // }
// }

const mapStateToProps = (state) => ({
    displayVideos: videoHistory(state.videos.visitedVideos, state.filters),
    resultDetail: state.videos.resultDetail,
    isSearchByKey: state.filters.isSearchByKey
});
  
export default connect(mapStateToProps)(HistoryList);