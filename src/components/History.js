import React from 'react';
import HistoryListFilters from './HistoryListFilters';
import List from './List';


const History = (props)=> {
    return(
            <div className="container">
                <HistoryListFilters />
                <List listType={'history'} />
            </div>
        )
}

export default History;