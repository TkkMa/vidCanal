import moment from 'moment';
// Get videos on display after filtering...etc

export const videoHistory = (videoArray, {startDate, endDate, text, isSaved, isSearchByKey}) =>{
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