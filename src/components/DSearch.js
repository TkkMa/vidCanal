const axios = require('axios');
const ROOT_URL = 'https://api.dailymotion.com/videos';
// const ROOT_URL_VIDEO = 'https://www.googleapis.com/youtube/v3/videos';
// const API_KEY='AIzaSyDWU_q-QSxsSUECDdeWI8WBnVE2q07p804';

const DSearch = (options={})=>{

  const params = {
    limit: options.num,
    search: options.term,
    sort: options.sortBy,
    page: options.pageToken
  };
  if(options.sortTimeVal){params.createdAfter=options.sortTimeVal;}

  return axios.get(ROOT_URL, { params: params })
    .then((response)=>{
      return {
        has_more: response.data.has_more,
        items: response.data.list, 
        nextPageToken: response.data.page + 1
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