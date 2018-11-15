import moment from 'moment';

// startDate & endDate for DatePicker
const filtersReducerDefaultState = {
    sortBy: 'relevance',
    uploadDate: 'allTime',
    startDate: moment().startOf('month'),
    endDate: moment(),
    text: '',
    resultsPerPage: 10,
    isSaved: false,
    unViewedFavCount: 0,
    unViewedFavIds:[],
    searchKeyFilter: [],
    playerChecked : {
        YT: true,
        V: false,
        D: false
    }
};

export default (state=filtersReducerDefaultState, action) =>{
    switch(action.type){
        case 'SET_SORT_BY':
            return{
                ...state,
                sortBy: action.text
            };
        case 'SET_UPLOAD_DATE':
            return{
                ...state,
                uploadDate: action.text
            };
        case 'SET_PLAYER':
            return{
                ...state,
                playerChecked: {
                    YT: action.choice.YT,
                    V: action.choice.V,
                    D: action.choice.D
                }
            };
        case 'SET_FAV_COUNT':
            return{
                ...state,
                unViewedFavCount: action.favCount.count,
                unViewedFavIds: action.favCount.ids
            };
        case 'SET_START_DATE':
            return {
                ...state,
                startDate: action.startDate
            };
        case 'SET_END_DATE':
            return {
                ...state,
                endDate: action.endDate
            };
        case 'SET_TEXT_FILTER':
            return{
                ...state,
                text: action.text
            };
        case 'SET_SEARCH_KEY_FILTER':
            return{
                ...state,
                searchKeyFilter: [...state.searchKeyFilter, action.text]
            };
        case 'CLEAR_SEARCH_KEY_FILTER':
            return{
                ...state,
                searchKeyFilter: []
            };
        case 'TOGGLE_ISSAVED_FILTER':
            return{
                ...state,
                isSaved: action.isSaved
            };
        default:
            return state;
    };
}