import _ from 'lodash';
import React, {Component} from 'react';
import {connect} from 'react-redux';
import HistoryListItem from './HistoryListItem';
import {videoHistory} from '../selectors/videos';

//-- Note unique id for key is necessary to output the correct number of filtered videos!
export class HistoryList extends Component {

    render(){
        const filteredVids = this.props.displayVideos;
        const searchKeyObj = _.groupBy(filteredVids, vid=>vid.searchKey);

        console.log('Begin History List');
            return(
                <div className="row">
                    <ul id="slide-out" className="sidenav">
                        <li>
                            <div className="user-view">
                                <a href="#user"><img className="circle" src={this.props.userPhoto}/></a>
                                <a href="#name"><span className="name">{this.props.userName}</span></a>
                                <a href="#email"><span className="email">{this.props.userEmail}</span></a>
                            </div>
                        </li>
                        <li><div className="divider"></div></li>
                        <li><a className="subheader">Searched terms (A-Z)</a></li>
                        {
                            Object.keys(searchKeyObj).map(key=>(
                                <li><a className="waves-effect" href="#!">{key}</a></li>
                            ))
                        }
                    </ul>
                    {(filteredVids.length===0) ? (
                            <p>No videos in video history under selected filters</p>
                        ) :(
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
                        )
                    }
                    
                </div>
            )           
        }
    // }
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
    userPhoto: state.auth.photo,
    userName: state.auth.name,
    userEmail: state.auth.email,
    displayVideos: videoHistory(state.videos.visitedVideos, state.filters),
    resultDetail: state.videos.resultDetail,
    isSearchByKey: state.filters.isSearchByKey
});
  
export default connect(mapStateToProps)(HistoryList);