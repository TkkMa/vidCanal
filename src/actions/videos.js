import database from '../firebase/firebase';

export const setSearchKey = ({
    text='',
    reRender=true,
    didMount=true
})=>({
    type:'SET_SEARCH_KEY',
    query: {text, reRender, didMount}
});

export const setDidMount = ({
    didMount= true
}) => ({
    type: 'SET_DID_MOUNT',
    didMount
});

export const setVideos = ({
        searchKey = '',
        updatedHits = [],
        engine = 'YT'   
    } = {}
) => ({
    type: 'SET_VIDEOS',
    videos: {searchKey, updatedHits, engine}
});

export const loadViewedVideos =()=>{
    return(dispatch, getState)=>{
        const uid = getState().auth.uid;

        return database.ref(`users/${uid}/history`)
                .once('value')
                .then((snapshot)=>{
                    const videos = [];
                    snapshot.forEach((childSnapshot)=>{
                        videos.push({
                            DB_id: childSnapshot.key,
                            ...childSnapshot.val()
                        });
                    });
                    if(videos.length){
                        dispatch(selectVideo({
                            searchKey: videos[videos.length-1].searchKey,
                            uniqueVideos:videos,
                            didMount: true,
                            reRender: true,
                            engine: videos[videos.length-1].engine
                        }));
                    }
                })
    }
}

//-- Sets the first video from list & user clicked video in Redux Store
export const selectVideo = (video)=>({
    type: 'SELECT_VIDEO',
    video
});

//-- will dispatch selectVideo by returning a function and save visited videos
export const startSelectVideo = (videoData={})=>{
    return (dispatch, getState)=>{
        const uid = getState().auth.uid;
        const {
            searchKey = '',
            updatedHitSelect = [],
            video = [],
            uniqueVideos = [],
            viewedAt = '',
            isSaved = false,
            reRender = true,
            didMount= true,
            engine='YT'
        } = videoData;
        const videoObj = {searchKey, updatedHitSelect, video, uniqueVideos, viewedAt, isSaved, reRender, didMount, engine};
        if(!!uid){
            return database.ref(`users/${uid}/history`).push({...video[0], viewedAt, searchKey, isSaved, engine}).then((ref)=>{
                videoObj.uniqueVideos=[{...video[0], DB_id:ref.key, viewedAt, searchKey, isSaved, engine}];
                dispatch(selectVideo(videoObj));
            })
        } else{
            videoObj.uniqueVideos=video;
            dispatch(selectVideo(videoObj));
        }
    };
};

export const saveVideo = (updatedVideos)=>({
    type: 'SAVE_VIDEO',
    updatedVideos
});

// Do a few things
//--(1) modify the isSaved field in history database
//--(2) modify visitedVideos array in redux
//--(3) Save videos in saved folder in database
export const startSaveVideo = (videoData={})=>{
    return (dispatch, getState) =>{
        const uid = getState().auth.uid;
        const {
            isSaved= false,
            updatedVideos=[],
            dbIds=[]
        } = videoData;

        const promiseArray=[];
        dbIds.forEach((id)=>{
            promiseArray.push(database.ref(`users/${uid}/history/${id}/isSaved`).set(isSaved))  
        });

        Promise.all(promiseArray).then(()=>{
            dispatch(saveVideo(updatedVideos));
        })
    }
}

export const clearVideoHistory =()=>({
    type: 'CLEAR_VIDEO_HISTORY'
})

export const startClearVideoHistory = ()=>{
    return(dispatch, getState) =>{
        const uid = getState().auth.uid;
        return database.ref(`users/${uid}/history`).remove().then(()=>{
            console.log("Remove succeeded");
            dispatch(clearVideoHistory());
        })
    }
}

export const setReRender = (isReRender=false)=>({
    type: 'SET_RE_RENDER',
    reRender: isReRender
})