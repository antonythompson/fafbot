const models = require('../../models');
const fafUserModel = models.FafUser;
let getFafId = async (discord_author) => {
    try{
        let user = await fafUserModel.findOne({where: {discord_id: discord_author.id}});
        if (user) {
            return user.faf_id;
        }
    } catch(e) {
        console.log('getFafId err', e);
    }
    return null;
}

let processArray = (items, process) => {
    return new Promise((resolve, reject) => {
        let todo = items.concat();
        setTimeout(function() {
            process(todo.shift());
            if(todo.length > 0) {
                setTimeout(arguments.callee, 25);
            } else {
                resolve()
            }
        }, 25);
    })
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
 *
 * @param msg
 * @returns {Promise<Channel>}
 */
let getUserActiveVoiceChannel = async (msg) => {
    let channel = null;
    msg.channel.guild.channels.cache.array().forEach(ch => {
        if (ch.type === 'voice' && ch.members.has(msg.author.id)) {
            channel = ch;
        }
    });
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
    getFafId: getFafId,
    processArray: processArray,
    getChannelByName: getChannelByName,
    moveUser: moveUser,
    getUserActiveVoiceChannel: getUserActiveVoiceChannel,
    getObjectValues: getObjectValues,
}