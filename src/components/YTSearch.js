const axios = require('axios');
const ROOT_URL = 'https://www.googleapis.com/youtube/v3/search';
const ROOT_URL_VIDEO = 'https://www.googleapis.com/youtube/v3/videos';
const API_KEY='AIzaSyDWU_q-QSxsSUECDdeWI8WBnVE2q07p804';

const YTSearch = (options={})=>{

  const params = {
    maxResults: options.num,
    part: 'snippet',
    key: API_KEY,
    q: options.term,
    type: 'video',
    order: options.sortBy,
    pageToken: options.pageToken
  };
  if(options.sortTimeVal){params.publishedAfter=options.sortTimeVal;}

  return axios.get(ROOT_URL, { params: params })
    .then((response)=>{
      return {
        pageInfo: response.data.pageInfo, 
        items: response.data.items, 
        nextPageToken: response.data.nextPageToken || '',
        prevPageToken: response.data.prevPageToken || ''
      };
    })
    .catch(function(error) {
      console.error(error);
    });  
}

const YTVideo = (options) =>{
  const params={
    id: options.id,
    key: API_KEY,
    part: 'snippet, statistics'
  }

  return axios.get(ROOT_URL_VIDEO, {params: params})
    .then((response)=>{
      return response.data.items
    })
    .catch(function(error) {
      console.error(error);
    });
}

module.exports = {
  YTSearch,
  YTVideo
}