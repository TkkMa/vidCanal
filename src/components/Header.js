import React, {Component} from 'react';
import {NavLink, withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {setSearchKey} from '../actions/videos';
import SearchBar from './SearchBar';
import HeaderBar from './HeaderBar';

export class Header extends Component {

    state={
        term: ''
    }

    static propTypes={
        history: PropTypes.object.isRequired
    }

    onSearchChange = (e) =>{
        this.setState({term:e.target.value});
    }

    onSearchSubmit = (e)=>{
        e.preventDefault();    
        this.props.setSearchKey({
            text: this.state.term,
            reRender: true,
            didMount: true
        });
        this.setState({term:''});
        //-- In the case when the search is conducted outside of path '/'.  ComponentWillReceiveProps will not
        //-- be initialised in that component with route '/'        
        if(this.props.history.location.pathname !== '/'){
            this.props.history.push('/');
        };
    }

    render(){
        const {term} = this.state;
        return(
            <div>
                <div className="page-header">
                    <div className="container">
                        <HeaderBar />
                    </div>
                </div>
                <div className="container">
                    <SearchBar
                        value={term}
                        onChange={this.onSearchChange}
                        onSubmit={this.onSearchSubmit}
                    />
                    <div className="row nav-bar">
                        <div className="col s12">
                            <ul ref="menuTab" className="tabsCustom light">
                                <li className="col s2 tabCustom" onClick={this.addActiveClass}>
                                    <NavLink to="/" activeClass="active" exact={true}>
                                        <i className="material-icons">featured_video</i><span>Videos</span>
                                    </NavLink>
                                </li>
                                <li className="col s2 tabCustom" onClick={this.addActiveClass}>
                                    <NavLink to="/history" activeClass="active" >
                                        <i className="material-icons">history</i><span>History</span>
                                    </NavLink>
                                </li>
                                <li className="col s2 tabCustom" onClick={this.addActiveClass}>
                                    <NavLink to="/saved" activeClass="active" >
                                        <i className="material-icons">star</i><span>Faves</span>
                                        {(this.props.count) ? 
                                            (<span className="new badge">{this.props.count}</span>) :
                                            ('')
                                        }
                                    </NavLink>
                                </li>
                                <li className="col s2 tabCustom" onClick={this.addActiveClass}>
                                    <NavLink to="/blog" activeClass="active" >
                                        <i className="material-icons">note_add</i><span>Blog</span>
                                    </NavLink>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state)=>({
    count: state.filters.unViewedFavCount,
});

const mapDispatchToProps = (dispatch)=>({
    setSearchKey: (text)=> dispatch(setSearchKey(text))
});

//-- withRouter used to ensure that active class is appended on clicked NavLink
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Header));