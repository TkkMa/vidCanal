import moment from 'moment';
// Get videos on display after filtering...etc

export const videoHistory = (videoArray, {startDate, endDate, text, isSaved}) =>{
    return videoArray.filter((video)=>{
            const viewedAtMoment = moment(video.viewedAt);
            const startDateMatch = startDate ? startDate.isSameOrBefore(viewedAtMoment, 'day') : true;
            const endDateMatch = endDate ? endDate.isSameOrAfter(viewedAtMoment,'day') : true;
            const textMatch = video.searchKey.toLowerCase().includes(text.toLowerCase()) || 
                                video.snippet.title.toLowerCase().includes(text.toLowerCase());
            const savedMatch = (isSaved) ? video.isSaved : true;
            return startDateMatch && endDateMatch && textMatch && savedMatch;
        }).sort((a, b) => {
            return moment(b.viewedAt).diff(moment(a.viewedAt));
        });
}

export const vidSearchInputs =(pageToggle, uploadDate, stateValues) => new Promise((resolve)=>{
    let {pageActive, maxViewedPage} = stateValues;
    console.log('pageActive', pageActive);
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
    console.log('pageActive after', pageActive);
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
    resolve({pageActive, maxViewedPage, sortTimeVal});
}) 