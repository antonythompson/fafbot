let faf = require('../../../faf-api');
let helper = require('../../../common/helper');
const models = require('../../../../models');
const Discord = require('discord.js');
const FafUser = models.FafUser;

module.exports = {
    name: 'sort',
    description: 'Sort everyone into team channels.',
    help: 'This will get everyone in your current match (which must have started) into separate voice channels based on team. \nUsage: `f/sort`',
    check: content => content.match(/^sort(.+)?/),
    run: async (msg, client) => {
        try{

            let active_channel = await helper.getUserActiveVoiceChannel(msg);
            if (!active_channel) {
                msg.channel.send(`You must be in a voice channel to run that command.`);
                return;
            }
            // console.log(active_channel.parentID)
            console.log('active_channel', active_channel.id, active_channel.parentID);

            let faf_id = await helper.getFafId(msg.author);
            if (!faf_id) {
                faf_id = await faf.searchUser(msg.author.username);
                if (faf_id) {
                    let user = FafUser.create({
                        discord_id: msg.author.id,
                        guild_id: msg.guild.id,
                        faf_id: faf_id
                    });
                } else {
                    msg.reply("I couldn't find your FAF username. Please set it, eg `f\/set antz` ")
                }
            }
            console.log('searching for match', faf_id);
            if (faf_id) {
                // let bot_promise = msg.channel.send('Tracking your match')
                let player_match = await faf.getPlayerCurrentMatch(faf_id);
                if (player_match) {
                    let match = await faf.getMatch(player_match.id);
                    console.log('match', match.id);
                    if (match && match.teams && match.teams.length) {
                        let size = (match.map.width / 51.2) + 'x' + (match.map.height / 51.2);
                        let team_fields = match.teams.map(team => {
                            return {
                                name: 'Team ' + team.team,
                                value: helper.getObjectValues(team.players, 'name').join('\n'),
                                inline: true
                            }
                        });
                        let report_fields = [{
                            name: 'Victory Condition',
                            value: match.victoryCondition,
                            inline: true
                        },{
                            name: 'Size',
                            value: size,
                            inline: true
                        },{ name: '\u200B', value: '\u200B' },...team_fields];
                        await helper.processArray(match.teams, async function(team){
                            let channel_name = `Team ${team.team} - ${match.name} (temp)`
                            let channel = await msg.channel.guild.channels.create(channel_name, {
                                type: 'voice',
                                reason: 'temp channel for a FAF game',
                                parent: active_channel.parentID
                            });
                            let player_ids = helper.getObjectValues(team.players, 'id')
                            let faf_users = FafUser.findAll({ where: {
                                faf_id: player_ids,
                                guild_id: msg.guild.id
                            }});
                            team.players.forEach(player => {
                                let found = false;
                                if (faf_users && faf_users.length) {
                                    faf_users.forEach(faf_user => {
                                        if (faf_user.faf_id === player.id) {
                                            found = true;
                                            helper.moveUser(client, msg.channel.guild.id, msg.author.id, channel.id);
                                        }
                                    })
                                }
                                if (!found) {
                                    active_channel.members.array().forEach(member => {
                                        if (member.displayName.toLowerCase() === player.name.toLowerCase()) {
                                            helper.moveUser(client, msg.channel.guild.id, member.id, channel.id);
                                        }
                                    })
                                }
                            })
                        });
                        let embed = {
                            description: match.map.description,
                            fields: report_fields,
                            image: {
                                url: encodeURI(match.map.thumbnailUrlLarge)
                            },
                        };
                        if (match.map.thumbnailUrlLarge) {
                            embed.thumbnail = {url: encodeURI(match.map.thumbnailUrlLarge)};
                        }
                        await helper.sendLog(msg.guild.id, {embed}, msg);
                    } else {
                        msg.channel.send(`I couldn't find the players in the match.`);
                    }

                } else {
                    msg.channel.send("I couldn't find your match");
                }
            }
        } catch (e) {
            console.log('caught exception', e);
        }
    }
}