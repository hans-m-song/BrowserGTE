const { Channel, Emote } = require('./Channel');

class FrankerFacez extends Channel {

    parseData(data) {
        const emotes = Object.values(data.sets)
            .reduce((emotes, set) => {
                set.emoticons.forEach((emote) => emotes.push({
                    code: emote.name,
                    id: emote.id,
                    src: emote.urls['1'],
                }));
                return emotes;
            }, []);
        return { emotes };
    }

    channelURL(id) {
        return `https://api.frankerfacez.com/v1/room/${id}`;
    }

    createEmote(emote) {
        return new Emote(emote.code, emote.id, emote.src);
    }

}

module.exports = FrankerFacez;