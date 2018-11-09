import React from 'react';
import FavoriteListFilters from './FavoriteListFilters';
import List from './List';

const Favorite = ()=>{
    return(
        <div className="container">
            <FavoriteListFilters />
            <List listType={'favorites'} />
        </div>
    )
}

export default Favorite