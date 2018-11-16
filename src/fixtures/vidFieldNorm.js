export const videoListObj = (video, engine) => {

    switch (engine){
        case 'YT':
            return{
                id: video.id.videoId,
                imageUrl: video.snippet.thumbnails.default.url,
                title: video.snippet.title,
                publishedAt: video.snippet.publishedAt,
                channelUrl: `http://www.youtube.com/channel/${video.snippet.channelId}`,
                channelTitle: video.snippet.channelTitle
            };
        case 'D':
            return{
                id: video.id,
                imageUrl: video.thumbnail_120_url,
                title: video.title,
                publishedAt: video.created_time*1000,
                channelUrl: video.ownerUrl,
                channelTitle: video.ownerScreenname
            };
        case 'V':
            return{
                id: video.uri.slice(8),
                imageUrl: video.pictures.sizes[0].link,
                title: video.name,
                publishedAt: video.release_time,
                channelUrl: video.user.link,
                channelTitle: video.user.name                
            }
        default:
            return null;
    }
}

export const videoDetailObj = (video) => {

    switch (video.engine){
        case 'YT':
            return{
                id: video.id,
                imageUrl: video.snippet.thumbnails.medium.url,
                title: video.snippet.title,
                publishedAt: video.snippet.publishedAt,
                channelUrl: `http://www.youtube.com/channel/${video.snippet.channelId}`,
                channelTitle: video.snippet.channelTitle,
                viewCount: video.statistics.viewCount,
                description: video.snippet.description,
                embedURL: `http://www.youtube.com/embed/${video.id}`,
                searchKey: video.searchKey,
                viewedAt: video.viewedAt,
                isSaved: video.isSaved,
                engine: video.engine
            };
        case 'D':
            return{
                id: video.id,
                imageUrl: video.thumbnail_180_url,
                title: video.title,
                publishedAt: video.created_time*1000,
                channelUrl: video.ownerUrl,
                channelTitle: video.ownerScreenname,
                viewCount: video.views_total,
                description: video.description,
                embedURL: video.embed_url,
                searchKey: video.searchKey,
                viewedAt: video.viewedAt,
                isSaved: video.isSaved,
                engine: video.engine
            };
        case 'V':
            return{
                id: video.uri.slice(8),
                imageUrl: video.pictures.sizes[1].link,
                title: video.name,
                publishedAt: video.release_time,
                channelUrl: video.user.link,
                channelTitle: video.user.name,
                viewCount: video.stats.plays || 0,
                description: video.description,
                embedURL: `https://player.vimeo.com/video/${video.uri.slice(8)}`,
                searchKey: video.searchKey,
                viewedAt: video.viewedAt,
                isSaved: video.isSaved,
                engine: video.engine
            };
        default:
            return null;
    }
}