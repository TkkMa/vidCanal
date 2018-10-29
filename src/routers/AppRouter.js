import React, {Component} from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import {connect} from 'react-redux';
import VideoApp from '../components/VideoApp';
import History from '../components/History';
import Favorite from '../components/Favorite';
import HeaderWithRouter from '../components/Header';
import NotFoundPage from '../components/NotFoundPage';

class AppRouter extends Component {
    // state={
    //     searchKey: DEFAULT_QUERY
    // }

    render(){
        console.log('AppRouter: ', this.props.searchKey);
        return(
            <BrowserRouter>
                <div className="container">
                    <HeaderWithRouter />
                    <Switch>
                        <Route path="/" render={(props)=><VideoApp searchKey={this.props.searchKey} {...props} />} exact={true}/>
                        <Route path="/history" component={History}/>
                        <Route path="/saved" component={Favorite}/>
                        <Route component={NotFoundPage} />
                    </Switch>
                </div>
            </BrowserRouter>
        )
    }
};

const mapStateToProps = (state)=>{
    return{
        searchKey: state.videos.searchKey
    }   
};

export default connect(mapStateToProps)(AppRouter);