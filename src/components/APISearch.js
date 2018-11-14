const axios = require('axios');
const ROOT_URL = {
    YT: 'https://www.googleapis.com/youtube/v3/search',
    D: 'https://api.dailymotion.com/videos',
    V: ''
}
const ROOT_URL_VIDEO = {
    YT: 'https://www.googleapis.com/youtube/v3/videos',
    D: 'https://api.dailymotion.com/video/',
    V: ''
};
const API_KEY='AIzaSyDWU_q-QSxsSUECDdeWI8WBnVE2q07p804';

const vidAPISearch = (options={}, engine='YT')=>{
    let params;
    if (engine === 'YT'){
        params = {
            maxResults: options.num,
            part: 'snippet',
            key: API_KEY,
            q: options.term,
            type: 'video',
            order: options.sortBy,
            pageToken: options.pageToken[engine]
        };
        if(options.sortTimeVal){params.publishedAfter=options.sortTimeVal;}

        return axios.get(ROOT_URL[engine], { params: params })
        .then(response=>{
            return {
                pageInfo: response.data.pageInfo, 
                items: response.data.items, 
                nextPageToken: response.data.nextPageToken || ''
            };
        })
        .catch(function(error) {
            console.error(error);
        });
    } else if(engine==='D'){
        params = {
            limit: options.num,
            search: options.term,
            sort: options.sortBy,
            page: options.pageToken[engine],
            fields: 'id,title,owner.screenname,owner.url,views_total,embed_url,created_time,description,thumbnail_60_url,thumbnail_120_url,thumbnail_180_url'
          };
        if(options.sortTimeVal){params.createdAfter=options.sortTimeVal;}

        return axios.get(ROOT_URL[engine], {params: params})
        .then(response=>{

            const arrayOfObj = response.data.list.map(({
                ['owner.screenname']: ownerScreenname,
                ['owner.url']: ownerUrl,
                ...rest
            })=>({
                ownerScreenname,
                ownerUrl,
                ...rest
            }))
            console.log('list', arrayOfObj);
            return {
                pageInfo: {
                    total: response.data.total,
                    has_more: response.data.has_more
                }, 
                items: arrayOfObj, 
                nextPageToken: options.pageToken[engine]+1
            };            
        })
        .catch(function(error) {
            console.error(error);
        });
    }  
}

//-- Daily motion only requires one API Call in the previous search request to get all fields
//-- Youtube requires two API calls
const indVidAPISearch = (options, engine='YT') =>{
    let params;
    if(engine==='YT'){
        params={
            id: options.id.videoId,
            key: API_KEY,
            part: 'snippet, statistics'
        }

        return axios.get(ROOT_URL_VIDEO[engine], {params: params})
            .then(response=>{
            return response.data.items
            })
            .catch(function(error) {
            console.error(error);
        });
    } else if(engine==='D'){
        return [options];
    }
};

module.exports = {
    vidAPISearch,
    indVidAPISearch
}