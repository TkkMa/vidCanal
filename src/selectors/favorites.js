import _ from 'lodash';

export default(videoArray)=>{
    const sortedVideoArray = videoArray.filter(video=> video.isSaved===true).reverse();
    return _.uniqBy(sortedVideoArray, 'id');
}