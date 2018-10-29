import React from 'react';
import HistoryListFilters from './HistoryListFilters';
import HistoryList from './HistoryList';


const History = (props)=> {
    return(
            <div>
                <HistoryListFilters />
                <HistoryList {...props} />
            </div>
        )
}

export default History;