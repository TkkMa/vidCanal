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
        <li className="sidenav__subheader">
            <a className="subheader">Searched terms (A-Z):</a>
            <i className="material-icons" onClick={props.onClearKeys}>clear_all</i>
        </li>
        {
            Object.keys(props.searchKeyObj).sort((a, b)=>{
                    return a.toLowerCase().localeCompare(b.toLowerCase());
                }).map(key=>(
                <li className="sidenav__list-item">
                    <a className="waves-effect" onClick={props.onClickedKey}>{key}</a>
                    {
                        (props.searchKeyFilter.indexOf(key)>-1) ?
                            (<i className="material-icons">check_box</i>) : 
                            (<i className="material-icons">check_box_outline_blank</i>)
                    }
                </li>
            ))
        }
    </ul>
)
export default SideNav;