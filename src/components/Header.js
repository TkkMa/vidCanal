import React, {Component} from 'react';
import {NavLink, withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {setSearchKey} from '../actions/videos';
import SearchBar from './SearchBar';

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
        console.log('query in header: ', this.state.term);
        // $("input[type='text']").val('');        
        this.props.setSearchKey({
            text: this.state.term,
            reRender: true,
            didMount: true
        });
        this.setState({term:''});
        //-- In the case when the search is conducted outside of path '/'.  ComponentWillReceiveProps will not
        //-- be initialised in that component with route '/'        
        if(this.props.location.pathname !== '/'){
            this.props.history.push('/');
        };
    }

    render(){
        const {term} = this.state;
        return(
            <div>
                <SearchBar
                    value={term}
                    onChange={this.onSearchChange}
                    onSubmit={this.onSearchSubmit}
                />
                <div className="row nav-bar">
                    <div className="col s12">
                        <ul ref="menuTab" className="tabsCustom light">
                            <li className="col s2 tabCustom">
                                <NavLink to="/" activeClassName="active" exact={true}>
                                    <i className="material-icons">featured_video</i>Videos
                                </NavLink>
                            </li>
                            <li className="col s2 tabCustom">
                                <NavLink to="/history" activeClassName="active">
                                    <i className="material-icons">history</i>History
                                </NavLink>
                            </li>
                            <li className="col s2 tabCustom">
                                <NavLink to="/saved" activeClassName="active">
                                    <i className="material-icons">star</i><span>Favorites</span>
                                    {(this.props.count) ? 
                                        (<span className="new badge">{this.props.count}</span>) :
                                        ('')
                                    }
                                </NavLink>
                            </li>
                            <li className="col s2 tabCustom">
                                <NavLink to="/blog" activeClassName="active">
                                <i className="material-icons">note_add</i>Blog
                                </NavLink>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state)=>{
    return{
        count: state.filters.count
    }   
};

const mapDispatchToProps = (dispatch)=>({
    setSearchKey: (text)=> dispatch(setSearchKey(text))
});

// export default Header;
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Header));
// export default connect(mapStateToProps, mapDispatchToProps)(Header);