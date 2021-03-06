import database from '../firebase/firebase';

//-- Set SortBy, uploadDate and player in videolist filter
export const setVideoFilters = (vidFilters)=>({
    type: 'SET_VIDEO_FILTERS',
    vidFilters
})

export const setFavCount = (favCount)=>({
    type: 'SET_FAV_COUNT',
    favCount
})

export const addFavCount = (countData={})=>{
    return(dispatch,getState) =>{
        const uid = getState().auth.uid;
        const {
            count = 0,
            videoId = '', 
            ids =[],
        } = countData;
        return database.ref(`users/${uid}/unSeenLikes`).push({videoId}).then((ref)=>{
            dispatch(setFavCount({
                count,
                ids: ids.concat({DB_id: ref.key, videoId})
            }));
        });
    };
};

export const removeFavCount = (countData={})=>{
    return(dispatch, getState) =>{
        const uid = getState().auth.uid;
        const {
            count=0,
            videoIds=[],
            foundDbId=''
        } = countData;
        return database.ref(`users/${uid}/unSeenLikes/${foundDbId}`).remove().then(()=>{
            dispatch(setFavCount({
                count,
                ids: videoIds 
            }));
        });
    };
};

export const clearFavCount = () =>{
    return(dispatch, getState) =>{
        const uid = getState().auth.uid;
        return database.ref(`users/${uid}/unSeenLikes`).remove().then(()=>{
            dispatch(setFavCount({
                count:0,
                ids: []
            }));
        });
    };
};

export const loadFavCount =()=>{
    return(dispatch, getState)=>{
        const uid = getState().auth.uid;
        return database.ref(`users/${uid}/unSeenLikes`)
                .once('value')
                .then((snapshot)=>{
                    const videoIds = [];

                    snapshot.forEach((childSnapshot)=>{
                        videoIds.push({
                            DB_id: childSnapshot.key,
                            ...childSnapshot.val()
                        });
                    });
                    if(videoIds.length){
                        dispatch(setFavCount({
                            count: videoIds.length,
                            ids: videoIds
                        }));
                    }
                })

    }
};

// SET_START_DATE
export const setStartDate = (startDate) => ({
    type: 'SET_START_DATE',
    startDate
  });
  
// SET_END_DATE
export const setEndDate = (endDate) => ({
    type: 'SET_END_DATE',
    endDate
});

// SET_TEXT_FILTER
export const setTextFilter = (text = '') => ({
    type: 'SET_TEXT_FILTER',
    text
});

// SET_SEARCH_KEY_FILTER
export const setSearchKeyFilter = (text='') =>({
    type: 'SET_SEARCH_KEY_FILTER',
    text
});

// CLEAR_SEARCH_KEY_FILTER
export const clearSearchKeyFilter = () =>({
    type: 'CLEAR_SEARCH_KEY_FILTER'
})

// TOGGLE_ISSAVED
export const toggleIsSavedFilter = (isSaved)=>({
    type: 'TOGGLE_ISSAVED_FILTER',
    isSaved
});

// RESET_FILTERS
export const resetFilters = ()=>({
    type: 'RESET_FILTERS'
});