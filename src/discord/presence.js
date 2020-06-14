const helper = require('../common/helper');
const faf = require('../faf-api')
const models = require('../../models');
const PresenceMatch = models.PresenceMatch
const fafUserModel = models.FafUser

module.exports = async function onPresenceUpdate(client, oldPresence, newPresence){
    // console.log('new activity', newPresence);
    // console.log('old activity', oldPresence);
    console.log('Checking presence update in ' + newPresence.guild.name)
    let newActivity = newPresence && newPresence.activities && newPresence.activities[0] && newPresence.activities[0].applicationID === process.env.FAF_DISCORD_APP_ID
        ? newPresence.activities[0] : null;
    let oldActivity = oldPresence && oldPresence.activities && oldPresence.activities[0] && oldPresence.activities[0].applicationID === process.env.FAF_DISCORD_APP_ID
        ? oldPresence.activities[0] : null;
    //trigger when a match goes from hosting to playing
    if (newActivity && oldActivity && newActivity.state === 'Playing'
        && oldActivity.state === 'Hosting') {
        console.log('FAF match hosted in ' + newPresence.guild.name)
                            //client, guild_id, match_id, active_channel
        let active_channel = await helper.getUserActiveVoiceChannel(client, newPresence.userID, newPresence.guild.id)
        if (active_channel) {
            console.log(active_channel);
            PresenceMatch.create({
                channel_id: active_channel.id,
                guild_id: newPresence.guild.id,
                faf_id: newActivity.party.id,
            })
            let match = await faf.sortFafMatch(client, newPresence.guild.id, newActivity.party.id, active_channel)
            if (match) {
                //post to the presence log channel?
            }
        }
    } else if(oldActivity && !newActivity && oldActivity.state === 'Playing') {
        //move everyone back to the original channel
        let presence_match = await PresenceMatch.findOne({where: {
            guild_id: newPresence.guild.id,
            faf_id: oldActivity.party.id,
        }})
        if (presence_match) {
            let match = await faf.getMatch(presence_match.faf_id)
            let guild_id = oldPresence.guild.id

            if (match && match.endTime !== null) {
                let discord_ids = await faf.getDiscordIdsFromMatch(match, guild_id);
                console.log('discord_ids getDiscordIdsFromMatch', discord_ids)
                if (discord_ids && discord_ids.length) {
                    let channel = await client.guilds.resolve(guild_id).channels.resolve(presence_match.channel_id);
                    if (channel) {
                        await helper.processArray(channel.parent.children.array(), async child => {
                            if (child.id !== presence_match.channel_id && child.type === 'voice') {
                                await helper.processArray(discord_ids,discord_id => {
                                    if (child.members.has(discord_id)) {
                                        helper.moveUser(client, guild_id, discord_id, presence_match.channel_id);
                                    }
                                });
                            }
                        })
                    }

                }
            }
        }
    }
}
