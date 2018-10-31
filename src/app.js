import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import AppRouter, {history} from './routers/AppRouter';
import configureStore from './store/configureStore';
import { loadViewedVideos, clearVideoHistory } from './actions/videos';
import { login, logout } from './actions/auth';
import 'normalize.css/normalize.css';
import './styles/styles.scss';
import 'react-dates/lib/css/_datepicker.css';
import './styles/components/react_dates_overrides.css';
import './../public/vendor/materialize.js'
import { firebase } from './firebase/firebase';

const store = configureStore();

const jsx = (
    <Provider store={store}>
        <AppRouter />
    </Provider>
);
let hasRendered = false;
const renderApp = ()=>{
    if(!hasRendered){
        ReactDOM.render(jsx , document.getElementById('app'));
        hasRendered=true;
    }
}

ReactDOM.render(<p>Loading...</p>, document.getElementById('app'));

firebase.auth().onAuthStateChanged((user)=>{
    store.dispatch(clearVideoHistory());
    if(user){
        const userProf={
            uid: user.uid,
            name: user.displayName,
            photo: user.photoURL,
            email: user.email
        }
        store.dispatch(login(userProf));
        store.dispatch(loadViewedVideos()).then(()=>{
            renderApp();
            if(history.location.pathname === '/'){
                history.push('/history')
            }
        });
    } else{
        store.dispatch(logout());
        renderApp();
        history.push('/');
    }
});