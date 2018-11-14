const DEFAULT_QUERY = 'redux';

const videosReducerDefaultState = {
    searchKey: DEFAULT_QUERY,
    results: {
       YT: null,
       D: null,
       V: null 
    },
    selectedVideo: {},
    visitedVideos:[],
    resultDetail: {
        YT: null,
        D: null,
        V: null 
    },
    reRender: true,
    didMount: true
};

export default (state = videosReducerDefaultState, action) =>{
    switch (action.type){
        case 'SET_SEARCH_KEY':
            return{
                ...state,
                searchKey: action.query.text,
                reRender: action.query.reRender,
                didMount: action.query.didMount
            };
        case 'SET_DID_MOUNT':
            return{
                ...state,
                didMount: action.didMount
            }
        case 'SET_VIDEOS':
            return {
                ...state,
                results: {
                    ...state.results,
                    [action.videos.engine]: {
                        ...state.results[action.videos.engine],
                        [action.videos.searchKey]: {hits:action.videos.updatedHits}
                    }
                }
            };
        case 'SELECT_VIDEO':
            return{
                ...state,
                didMount: action.video.didMount,
                searchKey: action.video.searchKey,
                resultDetail:{
                    ...state.resultDetail,
                    [action.video.engine]:{
                        ...state.resultDetail[action.video.engine],
                        [action.video.searchKey]:{hits:action.video.updatedHitSelect}
                    }    
                },
                selectedVideo: action.video.uniqueVideos[0],
                visitedVideos: [...state.visitedVideos, ...action.video.uniqueVideos],
                reRender: action.video.reRender
            };
        case 'SAVE_VIDEO':
            return{
                ...state,
                visitedVideos: action.updatedVideos
            };
        case 'CLEAR_VIDEO_HISTORY':
            return{
                ...state,
                visitedVideos: []
            };
        case 'SET_RE_RENDER':
            return{
                ...state,
                reRender: action.reRender
            }
        default:
            return state;
    }
};