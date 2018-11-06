import React, {Component} from 'react';
import { Router, Route, Switch } from 'react-router-dom';
import createHistory from 'history/createBrowserHistory';
import {connect} from 'react-redux';
import VideoApp from '../components/VideoApp';
import History from '../components/History';
import Favorite from '../components/Favorite';
import Header from '../components/Header';
import NotFoundPage from '../components/NotFoundPage';
import PrivateRoute from './PrivateRoute';

export const history = createHistory();

class AppRouter extends Component {

    render(){
        console.log('AppRouter: ', this.props.searchKey);
        return(
            <Router history={history}>
                <div>
                    <Header />
                    <Switch>
                        <Route path="/" render={(props)=><VideoApp searchKey={this.props.searchKey} {...props} />} exact={true}/>
                        <PrivateRoute path="/history" component={History}/>
                        <PrivateRoute path="/saved" component={Favorite}/>
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