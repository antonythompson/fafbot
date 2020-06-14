let faf = require('../../../faf-api');
let helper = require('../../../common/helper');
const models = require('../../../../models');
const Discord = require('discord.js');
const FafUser = models.FafUser;

module.exports = {
    name: 'sort',
    description: 'Sort everyone into team channels.',
    help: 'This will get everyone in your current match (which must have started) into separate voice channels based on team. \nUsage: `f/sort`',
    check: content => content.match(/^sort$/),
    run: async (msg, client) => {
        try{
            let guild_id = msg.channel.guild.id;
            let active_channel = await helper.getUserActiveVoiceChannel(client, msg.author.id, msg.guild.id);
            if (!active_channel) {
                return msg.channel.send(`You must be in a voice channel to run that command.`);
            }
            // console.log(active_channel.parentID)
            console.log('active_channel', active_channel.id, active_channel.parentID);

            let faf_id = await faf.getFafId(msg.author)
            if (!faf_id) {
                return msg.reply("I couldn't find your FAF username. Please set it, eg `f\/set antz` ")
            } else {
                // let bot_promise = msg.channel.send('Tracking your match')
                let player_match = await faf.getPlayerCurrentMatch(faf_id);
                if (player_match) {
                    let match = await faf.sortFafMatch(client, guild_id, player_match.id, active_channel);
                    if (match && match.teams && match.teams.length) {
                        let embed = faf.getMatchEmbed(match);
                        return msg.channel.send({embed});
                    } else {
                        return msg.channel.send(`There was a problem finding the match.`);
                    }
                } else {
                    return msg.channel.send("I couldn't find your match");
                }
            }
        } catch (e) {
            console.log('caught exception', e);
        }
    }
}