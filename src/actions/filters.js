export const setSortBy = (text='') => ({
    type: 'SET_SORT_BY',
    text
});

export const setUploadDate = (text='') => ({
    type: 'SET_UPLOAD_DATE',
    text
});

export const setResPerPage = (num)=>({
    type: 'SET_RESULTS_PER_PAGE',
    num
})

export const setFavCount = (favCount)=>({
    type: 'SET_FAV_COUNT',
    favCount
})

// SET_START_DATE
export const setStartDate = (startDate) => ({
    type: 'SET_START_DATE',
    startDate
  });
  
// SET_END_DATE
export const setEndDate = (endDate) => ({
    type: 'SET_END_DATE',
    endDate
});

// SET_TEXT_FILTER
export const setTextFilter = (text = '') => ({
    type: 'SET_TEXT_FILTER',
    text
});

// TOGGLE_ISSAVED
export const toggleIsSavedFilter = (isSaved)=>({
    type: 'TOGGLE_ISSAVED_FILTER',
    isSaved
})