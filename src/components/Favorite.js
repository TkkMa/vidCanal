import React from 'react';
import FavoriteListFilters from './FavoriteListFilters';
import FavoriteList from './FavoriteList';

const Favorite = ()=>{
    return(
        <div className="container">
            <FavoriteListFilters />
            <FavoriteList />
        </div>
    )
}

export default Favorite