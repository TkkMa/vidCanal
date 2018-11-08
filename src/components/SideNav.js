import React from 'react'

const SideNav = (props)=>(
    <ul id="slide-out" className="sidenav">
        <li>
            <div className="user-view">
                <img className="circle" src={props.auth.photo}/>
                <span className="name">{props.auth.name}</span>
                <span className="email">{props.auth.email}</span>
            </div>
        </li>
        <li><div className="divider"></div></li>
        <li><a className="subheader">Searched terms (A-Z):</a></li>
        {
            Object.keys(props.searchKeyObj).map(key => key.toLowerCase())
                                            .sort()
                                            .map(key=>(
                <li className="sidenav__list-item" onClick={props.onClickedKey}>
                    <a className="waves-effect" href="#!">{key}</a>
                    ()
                    <i className="material-icons">check_box</i>
                </li>
            ))
        }
    </ul>
)
export default SideNav;