import videosReducer from '../../reducers/videos';
import sAVideos from '../fixtures/searchAPIVideos';
import videos from '../fixtures/videos';

const dftState={
    searchKey: 'redux',
    results: null,
    selectedVideo: '',
    visitedVideos:[],
    resultDetail: null,
    nextPageToken: '',
    reRender: true,
    didMount: true
}

test('should set default state', ()=>{
    const state = videosReducer(undefined, {type: '@@INIT'});
    expect(state).toEqual({
        ...dftState
    })
});

test('should set search key', ()=>{
    const query={
        text: 'hello',
        reRender: false,
        didMount: false
    }
    const state = videosReducer(undefined, {type: 'SET_SEARCH_KEY', query});
    expect(state).toEqual({
        ...dftState,
        searchKey: query.text,
        reRender: query.reRender,
        didMount: query.didMount
    });
})

test('should set did mount', ()=>{
    const action = {
        type:'SET_DID_MOUNT',
        didMount: false
    }
    const state = videosReducer(undefined, action);
    expect(state.didMount).toBe(false);
})

test('should set videos in list', ()=>{
    const searchKey = 'redux';
    const updatedHits = sAVideos.items;
    const nextPageToken = sAVideos.nextPageToken;
    const action={
        type: 'SET_VIDEOS',
        videos: {
            searchKey,
            updatedHits,
            nextPageToken
        }
    }
    const state = videosReducer(undefined, action);
    expect(state).toEqual({
        ...dftState,
        results:{
            redux: {hits:updatedHits}
        },
        nextPageToken
    })
})

test('should set videos in page', ()=>{
    const searchKey = 'redux';
    const updatedHitSelect = [videos[1], videos[2], videos[3]];
    const didMount = false;
    const uniqueVideos = videos;
    const reRender = false;
    const action={
        type: 'SELECT_VIDEO',
        video:{
            searchKey, updatedHitSelect, didMount,
            uniqueVideos, reRender
        }
    }
    const state = videosReducer(undefined, action);
    expect(state).toEqual({
        ...dftState,
        didMount,
        searchKey,
        resultDetail:{
            redux: {hits:updatedHitSelect}
        },
        selectedVideo: uniqueVideos[0],
        visitedVideos: [...uniqueVideos],
        reRender
    })

})

test('should save video', ()=>{
    const action={
        type:'SAVE_VIDEO',
        updatedVideos: videos
    }
    const state = videosReducer(undefined, action);
    expect(state.visitedVideos).toEqual(videos);
})

test('should clear video history', ()=>{
    const action={
        type:'CLEAR_VIDEO_HISTORY',
    }
    const state= videosReducer(undefined, action);
    expect(state.visitedVideos).toBeFalsy;
})