const models = require('../../models');
const fafUserModel = models.FafUser;

let processArray = (items, process) => {
    return new Promise((resolve, reject) => {
        let todo = items.concat();
        setTimeout(async function() {
            await process(todo.shift());
            if(todo.length > 0) {
                setTimeout(arguments.callee, 25);
            } else {
                resolve()
            }
        }, 25);
    })
}

/**
 * @param promises_object should be something like {match: <Promise>, player: <Promise>}
 * @returns {Promise<void>}
 */
let handlePromiseAll = async promises_object => {
    let response = {};
    let promises = await Promise.all(Object.values(promises_object));
    let i = 0;
    await processArray(Object.keys(promises_object), key => {
        response[key] = promises[i]
        i++;
    })
    return response;
}

let getChannelByName = async (message, findByName) => {
    let voiceChannel = message.guild.channels.find((channel) => channel.id === findByName)
    if (voiceChannel === null) {
        voiceChannel = message.guild.channels.find(
            (channel) => channel.name.toLowerCase() === findByName.toLowerCase() && channel.type === 'voice'
        )
    }
    return voiceChannel
}

let getObjectValues = (array, key) => {
    return array.map(function(value, index) {
        return value[key];
    })
}

/**
 * Get a Discord users active voice channel
 * @param client
 * @param user_id
 * @param guild_id
 * @returns {Promise<*>}
 */
let getUserActiveVoiceChannel = async (client, user_id, guild_id) => {
    let channel = null;
    try {
        let channels = await client.guilds.resolve(guild_id).channels.cache.array()
        if (channels) {
            await processArray(channels, ch => {
                if (ch.type === 'voice' && ch.members.has(user_id)) {
                    channel = ch;
                }
            })
        }
    } catch(e) {
        console.log('err in getUserActiveVoiceChannel', e)
    }
    return channel;
}

let moveUser = (client, guild_id, user_id, voice_channel_id) => {
    console.log('moving user', user_id, guild_id, voice_channel_id);
    client.guilds
        .resolve(guild_id)
        .members.resolve(user_id)
        .voice.setChannel(voice_channel_id)
        .catch((err) => {
            if (err.message !== 'Target user is not connected to voice.') {
                console.log(err)
                console.log('Got above error when moving people...')
            }
            console.warn(user_id + ' left voice before getting moved')
        })
}

module.exports = {
    handlePromiseAll,
    processArray,
    getChannelByName,
    moveUser,
    getUserActiveVoiceChannel,
    getObjectValues,
}