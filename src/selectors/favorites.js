import _ from 'lodash';

export default(videoArray)=>{
    const sortedVideoArray = videoArray.filter(video=> video.isSaved===true).reverse();
    return _.uniqBy(sortedVideoArray, 'id');
}

// export default(videoArray)=>{
//     // Assuming that videoArray is already arranged chronologically
//     const videoIdArray = videoArray.slice(0).reverse().map(video=>video.id);
//     return videoArray.slice(0).reverse().filter((video, index)=>{
//         return (video.isSaved && videoIdArray.indexOf(video.id)==index)
//     });
// }