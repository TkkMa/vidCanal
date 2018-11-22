import moment from 'moment';
// Get videos on display after filtering...etc

export const videoHistory = (videoArray, {startDate, endDate, text, isSaved}) =>{
    return videoArray.filter((video)=>{
            const viewedAtMoment = moment(video.viewedAt);
            const startDateMatch = startDate ? startDate.isSameOrBefore(viewedAtMoment, 'day') : true;
            const endDateMatch = endDate ? endDate.isSameOrAfter(viewedAtMoment,'day') : true;
            const textMatch = video.searchKey.toLowerCase().includes(text.toLowerCase()) || 
                                video.title.toLowerCase().includes(text.toLowerCase());
            const savedMatch = (isSaved) ? video.isSaved : true;
            return startDateMatch && endDateMatch && textMatch && savedMatch;
        }).sort((a, b) => {
            return moment(b.viewedAt).diff(moment(a.viewedAt));
        });
}

// Mapping sort values where object keys belong to YT's
const sortValueMap = {
    relevance: {
        D: 'relevance',
        V: 'relevant'
    },
    viewCount: {
        D: 'visited',
        V: 'plays'
    },
    date: {
        D: 'recent',
        V: 'date'
    },
    title:{
        D: '',
        V: 'alphabetical'
    }
}

export const vidSearchInputs =(pageToggle, uploadDate, sortBy, engine, pageActive, maxViewedPage) => new Promise((resolve)=>{
    switch (pageToggle){
        case 'first_page':
            pageActive = 1;
            break;
        case 'chevron_left':
            pageActive = Math.max(pageActive-1, 1);
            break;
        case 'chevron_right':
            pageActive = pageActive + 1;
            maxViewedPage = Math.max(pageActive, maxViewedPage);
            break;
        case 'last_page':
            pageActive = maxViewedPage;
            break;
        default:
            pageActive = 1;
            maxViewedPage = 1;
    }
    let sortTimeVal;
    switch(uploadDate){
        case 'today':
            sortTimeVal = moment().startOf('day').format();
            break;
        case 'week':
            sortTimeVal = moment().startOf('week').format();
            break;
        case 'month':
            sortTimeVal =  moment().startOf('month').format();
            break;
        case 'year':
            sortTimeVal = moment().startOf('year').format();
            break;
        case 'fiveYears':
            sortTimeVal = moment().subtract(5, 'years').format();
            break;
        case 'allTime':
            sortTimeVal = '';
            break;                               
        default:
            sortTimeVal = '';
    };
    
    let sortByVal;
    if(engine === 'V' || engine === 'D'){
        Object.keys(sortValueMap).map(key=>{
            if(key === sortBy){
                sortByVal = sortValueMap[key][engine]
            }
        });
    } else{
        sortByVal = sortBy;
    }

    resolve({pageActive, maxViewedPage, sortTimeVal, sortByVal});
})

export const isLastPageFunc = ({items, pageInfo}, {resultsPerPage}, engine)=>{
    let isLastPageBool; 
    switch(engine){
        case('YT'):
            isLastPageBool = (items.length < resultsPerPage);
            break;
        case('D'):
            isLastPageBool = !pageInfo.has_more;
            break;
        case('V'):
            isLastPageBool = (pageInfo.paging.next === null)
            break;
        default:
            isLastPageBool = false;
    }
    return isLastPageBool;
}