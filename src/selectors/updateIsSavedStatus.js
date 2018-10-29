export default ({isSaved, visitedVideos, currentVideo, startSaveVideo}) =>{
    const dbIds = [];
    const updatedVideos = visitedVideos.map(video =>{
        if(video.id===currentVideo.id){
            video.isSaved = isSaved;
            dbIds.push(video.DB_id);
        }
        return video;
    })
    startSaveVideo({
        isSaved: result.isSaved,
        updatedVideos,
        dbIds
    })
}