const paginationReducerDefaultState= {
    pageActive:{
        YT: 1,
        D: 1,
        V: 1
    },
    maxViewedPage:{
        YT: 1,
        D: 1,
        V: 1
    },
    lastPageFound: {
        YT: false,
        D: false,
        V: false
    },
    lastPageReached:{
        YT: false,
        D: false,
        V: false
    },
    nextPageToken:{
        YT: '',
        D: 1,
        V: 1
    },
    resultsPerPage: 10,
};

export default (state = paginationReducerDefaultState, action) =>{
    switch(action.type){
        case 'SET_PAGE_TOKEN':
            return{
                ...state,
                nextPageToken: {
                    ...state.nextPageToken,
                    [action.token.engine]:action.token.nextPageToken
                }
            };
        case 'SET_PAGE_CONFIG':
            return{
                ...state,
                lastPageReached:{
                    ...state.lastPageReached,
                    [action.pagination.engine]:action.pagination.lastPageReached
                },
                pageActive:{
                    ...state.pageActive,
                    [action.pagination.engine]: action.pagination.pageActive
                },
                maxViewedPage:{
                    ...state.maxViewedPage,
                    [action.pagination.engine]: action.pagination.maxViewedPage
                },
                lastPageFound:{
                    ...state.lastPageFound,
                    [action.pagination.engine]:action.pagination.lastPageFound
                }                
            };
        case 'SET_RESULTS_PER_PAGE':
            return{
                ...state,
                resultsPerPage: action.num
            };
        default:
            return state;
    }

}    