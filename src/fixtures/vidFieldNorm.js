export const videoListObj = (videos, engine) => {

    switch (engine){
        case 'YT':
            return {
                ...videos,
                items: videos.items.map(video=>({
                    id: video.id.videoId,
                    imageUrl: video.snippet.thumbnails.default.url,
                    title: video.snippet.title,
                    publishedAt: video.snippet.publishedAt,
                    channelUrl: `https://www.youtube.com/channel/${video.snippet.channelId}`,
                    channelTitle: video.snippet.channelTitle
                }))
            }
        case 'D':
            return {
                ...videos,
                items: videos.items.map(video=>({
                    id: video.id,
                    imageUrl: video.thumbnail_120_url,
                    imageUrl_medium: video.thumbnail_180_url,
                    title: video.title,
                    publishedAt: video.created_time*1000,
                    channelUrl: video.ownerUrl,
                    channelTitle: video.ownerScreenname,
                    viewCount: video.views_total,
                    description: video.description,
                    embedURL: `https://www.dailymotion.com/embed/video/${video.id}`
                }))
            }
        case 'V':
            return {
                ...videos,
                items: videos.items.map(video=>({
                    id: video.uri.slice(8),
                    imageUrl: video.pictures.sizes[0].link,
                    imageUrl_medium: video.pictures.sizes[1].link,
                    title: video.name,
                    publishedAt: video.release_time,
                    channelUrl: video.user.link,
                    channelTitle: video.user.name,
                    viewCount: video.stats.plays || 0,
                    description: video.description,
                    embedURL: `https://player.vimeo.com/video/${video.uri.slice(8)}`
                }))
            }
        default:
            return {};
    }
}

export const videoDetailArr = (video, engine) => {

    switch (engine){
        case 'YT':
            return [{
                id: video.id,
                imageUrl: video.snippet.thumbnails.default.url,
                imageUrl_medium: video.snippet.thumbnails.medium.url,
                title: video.snippet.title,
                publishedAt: video.snippet.publishedAt,
                channelUrl: `https://www.youtube.com/channel/${video.snippet.channelId}`,
                channelTitle: video.snippet.channelTitle,
                viewCount: video.statistics.viewCount,
                description: video.snippet.description,
                embedURL: `https://www.youtube.com/embed/${video.id}`
            }];
        case 'D':
            return [video];
        case 'V':
            return [video];
        default:
            return [];
    }
}