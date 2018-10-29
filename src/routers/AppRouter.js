import React, {Component} from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import createHistory from 'history/createBrowserHistory';
import {connect} from 'react-redux';
import VideoApp from '../components/VideoApp';
import History from '../components/History';
import Favorite from '../components/Favorite';
import HeaderWithRouter from '../components/Header';
import NotFoundPage from '../components/NotFoundPage';

export const history = createHistory();

class AppRouter extends Component {
    // state={
    //     searchKey: DEFAULT_QUERY
    // }

    render(){
        console.log('AppRouter: ', this.props.searchKey);
        return(
            <Router history={history}>
                <div className="container">
                    <HeaderWithRouter />
                    <Switch>
                        <Route path="/" render={(props)=><VideoApp searchKey={this.props.searchKey} {...props} />} exact={true}/>
                        <Route path="/history" component={History}/>
                        <Route path="/saved" component={Favorite}/>
                        <Route component={NotFoundPage} />
                    </Switch>
                </div>
            </Router>
        )
    }
};

const mapStateToProps = (state)=>{
    return{
        searchKey: state.videos.searchKey
    }   
};

export default connect(mapStateToProps)(AppRouter);