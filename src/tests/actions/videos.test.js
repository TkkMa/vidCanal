import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import {setSearchKey, setDidMount, setVideos,
        loadViewedVideos, selectVideo, startSelectVideo,
        saveVideo, startSaveVideo, clearVideoHistory,
        startClearVideoHistory} from '../../actions/videos';
import videos from '../fixtures/indivAPIVideo';
import database from '../../firebase/firebase';

const uid = 'thisismytestuid';
const defaultAuthState = {auth: {uid}};
const createMockStore=configureMockStore([thunk]);

test('should set search Key action object', ()=>{
   const action = setSearchKey({text:'123abc'});
   expect(action).toEqual({
       type: 'SET_SEARCH_KEY',
       query: {
           text: '123abc',
           reRender: true,
           didMount: true
        }
   }); 
});

test('should set didMount action object', ()=>{
    const action = setDidMount({didMount: false});
    expect(action).toEqual({
        type: 'SET_DID_MOUNT',
        didMount : false
    })
});

test('should set videos action object with provided values', ()=>{
    const videoData = {
        searchKey: 'redux',
        updatedHits: ['video1', 'video2', 'video3'],
        nextPageToken: 'RXD12A'
    }
    const action = setVideos(videoData);
    expect(action).toEqual({
        type: 'SET_VIDEOS',
        videos:{
            ...videoData
        }
    })
});

test('should set videos action object with default values', ()=>{
    const action = setVideos();
    expect(action).toEqual({
        type: 'SET_VIDEOS',
        videos:{
            searchKey: '',
            updatedHits: [],
            nextPageToken: ''
        }
    })
});

test('should add video to database and store', (done)=>{
    const store = createMockStore(defaultAuthState);
    const videoData = {
        searchKey:'redux',
        updatedHitSelect : [videos[0]],
        video : [videos[0]],
        uniqueVideos:[],
        viewedAt: 1000,
        isSaved: false,
        reRender:true,
        didMount:true
    };

    store.dispatch(startSelectVideo(videoData)).then(()=>{
        const actions = store.getActions();
        expect(actions[0]).toEqual({
            type: 'SELECT_VIDEO',
            video:{
                ...videoData,
                uniqueVideos:[{
                    ...videos[0],
                    DB_id: expect.any(String),
                    viewedAt: 1000,
                    searchKey: 'redux',
                    isSaved: false
                }]
            }
        });
        return database.ref(`users/${uid}/history/${actions[0].video.uniqueVideos[0].DB_id}`).once('value');
    }).then((snapshot)=>{
        expect(snapshot.val()).toEqual({...videos[0], viewedAt:1000, searchKey:'redux', isSaved:false});
        done();
    });
});

test('should add video with defaults to database and store', (done)=>{
    const store = createMockStore(defaultAuthState);
    const videoDataDefaults = {
        searchKey:'',
        updatedHitSelect : [],
        video : [],
        uniqueVideos:[],
        viewedAt: '',
        isSaved: false,
        reRender:true,
        didMount:true
    };
    store.dispatch(startSelectVideo({})).then(()=>{
        const actions = store.getActions();
        expect(actions[0]).toEqual({
            type: 'SELECT_VIDEO',
            video:{
                ...videoDataDefaults,
                uniqueVideos:[{
                    DB_id: expect.any(String),
                    viewedAt: '',
                    searchKey: '',
                    isSaved: false
                }]
            }
        });
        return database.ref(`users/${uid}/history/${actions[0].video.uniqueVideos[0].DB_id}`).once('value');
    }).then((snapshot)=>{
        expect(snapshot.val()).toEqual({viewedAt:'', searchKey:'', isSaved:false});
        done();
    });
});

test('should clear video history from database', (done)=>{
    const store = createMockStore(defaultAuthState);
    store.dispatch(startClearVideoHistory()).then(()=>{
        const actions = store.getActions();
        expect(actions[0]).toEqual({
            type: 'CLEAR_VIDEO_HISTORY'
        })
        return database.ref(`users/${uid}/history`).once('value');
    }).then((snapshot)=>{
        expect(snapshot.val()).toBeFalsy();
        done();
    });
});

