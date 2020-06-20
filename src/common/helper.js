const models = require('../../models');
const fafUserModel = models.FafUser;
const guildModel = models.Guild;
const GuildJoin = models.GuildJoin;
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

/**
 *
 * @param guild_id
 * @param message String|MessageEmbed
 * @param context Message|Presence
 * @returns {Promise<boolean|Message|Array<Message>>}
 */
let sendLog = async (guild_id, message, context) => {
    if (typeof context === 'object' && context.hasOwnProperty('client')) {
        let guild_db = await guildModel.findOne({where: {guild_id}})
        let guild = context.hasOwnProperty('guild') ? context.guild : context.client.guilds.resolve(guild_id)
        if (guild && guild_db && guild_db.match_log_channel_id) {
            let channel = guild.channels.cache.find(ch => ch.id === guild_db.match_log_channel_id)
            if (channel && channel.type === 'text') {
                return channel.send(message)
            }
        } else if (guild && context.hasOwnProperty('channel') && context.type === 'text') {
            return context.send(message)
        }
    }
    return false;
}

let addGuildMembers = async guild => {
    await processArray(guild.members.cache.array(), async member => {
        if (!member.user.bot) {
            console.log(new Date(member.joinedTimestamp));
            let data = {
                name: member.user.username,
                join_date: new Date(member.joinedTimestamp),
            };
            let where = {
                discord_id: member.user.id,
                guild_id: member.guild.id,
            }
            console.log('data', where, data);
            let res = await GuildJoin.findOrCreate({where: where, defaults: data})
            // if (!res[1]) {
            //     res[0].set(data);
            //     res[0].save();
            // }
        }
    })
}

let findOrCreateGuild = async guild => {
    let db_guild = await guildModel.findOne({where: {guild_id: guild.id}});
    console.log('guild find', db_guild);
    if (!db_guild) {
        db_guild = await guildModel.create({
            guild_id: guild.id,
            name: guild.name,
            description: guild.description,
            icon: guild.icon,
            banner: guild.banner,
            region: guild.region,
        });
    }
    return db_guild;
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
    sendLog,
    findOrCreateGuild,
    addGuildMembers,
    getFafId: getFafId,
    processArray: processArray,
    getChannelByName: getChannelByName,
    moveUser: moveUser,
    getUserActiveVoiceChannel: getUserActiveVoiceChannel,
    getObjectValues: getObjectValues,
}