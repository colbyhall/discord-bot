const { GuildMember } = require('discord.js');
const request = require('superagent');

module.exports = {

    /**
     * Returns music data array 
     * @param { String } keywords
     * @param { GuildMember } member
     * @param { Function } cb
     */
    videoSearch(keywords, member, cb) {
        const requestUrl = 'https://www.googleapis.com/youtube/v3/search' + `?part=snippet&q=${escape(keywords)}&key=${tokens.youtube}&type=video`;

        request.get(requestUrl, (err, res) => {
            if (res.statusCode == 200) {
                const body = res.body;
                if (body.items.length == 0) {
                    cb('Couldn\'t find any videos matching those tags');
                    return;
                }
                
                let videos = [];

                for (const item of body.items) {
                    if (item.id.kind == 'youtube#video') {
                        videos.push({
                            url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
                            title: item.snippet.title,
                            thumbnail: item.snippet.thumbnails.medium.url,
                            requestor: author,
                            videoId: item.id.videoId
                        });
                    }
                }
                cb(null, videos);
            }
            else {
                cb('Couldn\'t contact Youtube');
            }
        });
    },
    /**
     * Returns music data array 
     * @param { String } keywords
     * @param { GuildMember } member
     * @param { Function } cb
     */
    playlistSearch(keywords, member, cb) {
        const requestUrl = 'https://www.googleapis.com/youtube/v3/search' + `?part=snippet&q=${escape(keywords)}&key=${tokens.youtube}&type=playlist`;
        
        request.get(requestUrl, (err, res) => {
            if (res.statusCode == 200) {
                const body = res.body;
                if (body.items.length == 0) {
                    cb('Couldn\'t find any videos matching those tags');
                    return;
                }
                
                let videos = [];

                for (const item of body.items) {
                    if (item.id.kind == 'youtube#video') {
                        videos.push({
                            url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
                            title: item.snippet.title,
                            thumbnail: item.snippet.thumbnails.medium.url,
                            requestor: author,
                            videoId: item.id.videoId
                        });
                    }
                }
                cb(null, videos);
            }
            else {
                cb('Couldn\'t contact Youtube');
            }
        });
    }

}