const axios = require('axios');
const moment = require('moment');

const ROOT_URL = {
    YT: 'https://www.googleapis.com/youtube/v3/search',
    D: 'https://api.dailymotion.com/videos',
    V: 'https://api.vimeo.com/videos'
}
const ROOT_URL_VIDEO = {
    YT: 'https://www.googleapis.com/youtube/v3/videos'
    // D: 'https://api.dailymotion.com/video/',
    // V: 'https://api.vimeo.com/videos'
};
const API_KEY= {
    YT:'AIzaSyDWU_q-QSxsSUECDdeWI8WBnVE2q07p804',
    V: 'f0ca0fbcd4918f82208f732dfded4341'
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


const vidAPISearch = (options={}, engine='YT')=>{
    let params;
    if (engine === 'YT'){
        params = {
            maxResults: options.num,
            part: 'snippet',
            key: API_KEY.YT,
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
                return null;
            });
    } else if(engine==='D'){
        params = {
            limit: options.num,
            search: options.term,
            sort: options.sortBy,
            page: options.pageToken[engine],
            fields: 'id,title,owner.screenname,owner.url,views_total,embed_url,created_time,description,thumbnail_60_url,thumbnail_120_url,thumbnail_180_url'
          };
        Object.keys(sortValueMap).map(key=>{
            if(key === params.sort){
                params.sort = sortValueMap[key][engine]
            }
        })
        if(options.sortTimeVal){params.created_after=moment(options.sortTimeVal).unix();}

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
                return null;
            });
    } else if(engine==='V'){
        params = {
            access_token: API_KEY.V,
            per_page: options.num,
            query: options.term,
            page: options.pageToken[engine],
            sort: options.sortBy,
            fields:'total,page,per_page,paging,data,uri,pictures,name,release_time,user,stats,description,embed'
        }
        Object.keys(sortValueMap).map(key=>{
            if(key === params.sort){
                params.sort = sortValueMap[key][engine];
            }
        })
        // if(options.sortTimeVal){params.filter=moment(options.sortTimeVal).unix();}
        return axios.get(ROOT_URL[engine], { params: params })
            .then(response=>{
                return {
                    pageInfo: {
                        paging: response.data.paging,
                        total: response.data.total
                    }, 
                    items: response.data.data, 
                    nextPageToken: options.pageToken[engine]+1
                };
            })
            .catch(function(error) {
                console.error(error);
                return null;
            });
    }  
}

//-- Daily motion and Vimeo only requires one API Call in the previous search request to get all fields
//-- Youtube requires two API calls
const indVidAPISearch = (options, engine='YT') =>{
    let params;
    if(engine==='YT'){
        params={
            id: options.id,
            key: API_KEY.YT,
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
    } else if(engine==='V'){
        return [options];
    }
};

module.exports = {
    vidAPISearch,
    indVidAPISearch
}