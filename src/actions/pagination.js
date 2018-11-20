export const setPageConfig = ({
    engine = 'YT',
    lastPageReached = false,
    lastPageFound = false,
    maxViewedPage = 1,
    pageActive = 1,
}={})=>({
    type: 'SET_PAGE_CONFIG',
    pagination: {engine, lastPageReached, lastPageFound, maxViewedPage, pageActive}
});

export const setResPerPage = (num)=>({
    type: 'SET_RESULTS_PER_PAGE',
    num
});

export const setPageToken = ({
    engine = 'YT',
    nextPageToken = ''
}) =>({
    type: 'SET_PAGE_TOKEN',
    token : {engine, nextPageToken}
})

export const clearAllPageToken = (num)=>({
    type: 'CLEAR_ALL_PAGE_TOKENS',
    num
})