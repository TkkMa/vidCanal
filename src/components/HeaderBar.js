import React from 'react';
import {connect} from 'react-redux';
import {startLogin, startLogout} from '../actions/auth';

const HeaderBar = ({isAuthenticated, name, startLogin, startLogout})=>(
    <div className="HB-1">
        <ul className="HB-1__list">
            <li className="HB-1__item-1">{
                (isAuthenticated) ? <div><i className="material-icons small">person</i><span>{name}</span></div> : ''}
            </li>
            <li>       
                <button 
                    onClick={(isAuthenticated) ? startLogout : startLogin}
                    className="btn-flat waves-effect waves-light btn-small right"
                >
                    {(isAuthenticated)? 'Logout' : 'Login'}
                </button>
            </li>
        </ul>
    </div>
)

const mapStateToProps = (state)=>({
    isAuthenticated: !!state.auth.uid,
    name: state.auth.name
})

const mapDispatchToProps = (dispatch)=>({
    startLogin: ()=>dispatch(startLogin()),
    startLogout: ()=>dispatch(startLogout())
});

export default connect(mapStateToProps, mapDispatchToProps)(HeaderBar)