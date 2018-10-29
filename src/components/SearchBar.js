import React, {Component} from 'react';
import {connect} from 'react-redux';
import {startLogin, startLogout} from '../actions/auth';

export class SearchBar extends Component {
    componentDidMount(){
        if(this.input){
            this.input.focus();
        }
    }
    render(){
        const {onChange, value, onSubmit, startLogin, startLogout} = this.props;
        return(
            <div className="row search-bar-row">
                <form onSubmit={onSubmit} className="col s12">
                    <div className="input-field col s5 offset-s3 search-bar">
                        <input
                        type='text' 
                        value={value}
                        onChange={onChange}
                        placeholder='Search videos'
                        ref={el => this.input= el}
                        />                                     
                    </div>
                    <div className="col s1">
                        <button className="btn waves-effect waves-light btn-small" type="submit" name="action">
                            <i className="material-icons">search</i>
                        </button>                
                    </div>
                    <div className="col s2 right">
                        <button onClick={startLogin} className="btn-flat waves-effect waves-light btn-small right">
                            Login
                        </button>
                    </div>
                    <div className="col s2 right">
                        <button onClick={startLogout} className="btn-flat waves-effect waves-light btn-small right">
                            Logout
                        </button>
                    </div>
                </form>  
            </div>
        )
    }
}

const mapDispatchToProps = (dispatch)=>({
    startLogin: ()=>dispatch(startLogin()),
    startLogout: ()=>dispatch(startLogout())
});

export default connect(undefined, mapDispatchToProps)(SearchBar);