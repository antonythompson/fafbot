const axios = require('axios');
let helper = require('../common/helper')
const models = require('../../models');
const fafUserModel = models.FafUser;


let getPlayerCurrentMatch = async player_id => {
    let result;
    try{
        let url = `https://api.faforever.com/data/gamePlayerStats?include=game&filter=player.id==${player_id}&sort=-id&page[size]=1`
        let res = await axios.get(url)
        console.log('getPlayerCurrentMatch');
        console.log(res.data.included[0]);
        if (res.data && res.data.included
            && res.data.included[0]
            && res.data.included[0].attributes
            && res.data.included[0].attributes.endTime === null) {
            result = res.data.included[0];
        }
    } catch (e) {
        console.log('err in searchUser', e);
    }
    return result;
}
let searchUser = async term => {
    let result;
    try{
        let url = `https://api.faforever.com/data/player?filter=login=="${term}"&page[size]=1`
        let res = await axios.get(url);
        if (res.data && res.data.data && res.data.data[0]) {
            result = res.data.data[0].id;
        }
    } catch (e) {
        console.log('err in searchUser', e);
    }
    return result;
}
/**
 * Get a match from the api
 * @param match_id
 */
let getMatch = async match_id => {
    let match = null;
    try {
        let game_url = `https://api.faforever.com/data/game/${match_id}?include=playerStats,mapVersion`
        let res = await axios.get(game_url);
        if (res.data) {
            let featured_mods = {
                0: "FAF",
                1: "Murder Party",
                4: "Nomads",
                5: "LABwars",
                6: "Ladder1v1",
                12: "Xtreme Wars",
                14: "Diamond",
                16: "Phantom-X",
                18: "Vanilla",
                20: "King of the Hill",
                21: "Claustrophobia",
                24: "Galactic War",
                25: "Coop",
                26: "Matchmaker",
                27: "FAF Beta",
                28: "FAF Develop",
                29: "Equilibrium",
                30: "Tutorials",
            }
            let matchData = res.data;
            match = matchData.data.attributes;
            match.id = matchData.data.id;
            match.host_id = matchData.data.relationships.host.data.id;
            match.featured_mod_id = matchData.data.relationships.featuredMod.data.id;
            match.featured_mod = featured_mods[match.featured_mod_id] ? featured_mods[match.featured_mod_id] : '';
            console.log('inside after');
            console.log(match);
            let player_in_team = {};
            let query = '';
            await helper.processArray(res.data.included,item => {
                console.log(item);
                if (item.type === 'gamePlayerStats') {
                    let player_id = item.relationships.player.data.id;
                    player_in_team[player_id] = item.attributes.team - 1;
                    if (query === '') {
                        query = query + 'id==' + player_id;
                    } else {
                        query = query + ',id==' + player_id;
                    }
                } else if (item.type === 'mapVersion') {
                    match.map = item.attributes;
                } else if (item.type === 'player') {
                    match.host = {
                        id: item.id,
                        login: item.attributes.login
                    };
                }
            })
            let url = `https://api.faforever.com/data/player?filter=${query}&page[size]=16`
            let player_res = await axios.get(url);
            let teams = {};
            console.log('players in match', player_res.data);
            if (player_res.data && player_res.data.data) {
                await helper.processArray(player_res.data.data,player => {
                    if (!teams[player_in_team[player.id]]) {
                        teams[player_in_team[player.id]] = {
                            team: player_in_team[player.id],
                            players: []
                        };
                    }
                    teams[player_in_team[player.id]].players.push({
                        id: player.id,
                        name: player.attributes.login,
                    })
                })
                match.teams = Object.values(teams);
            }
        }
    } catch (e) {
        console.log('err', e);
    }
    return match
}
let getMatchEmbed = match => {
    let size = (match.map.width / 51.2) + 'x' + (match.map.height / 51.2);
    let team_fields = match.teams.map(team => {
        let team_name = 'Team ' + team.team;
        if (team.team === 0) {
            team_name = 'No team'
        }
        return {
            name: team_name,
            value: helper.getObjectValues(team.players, 'name').join('\n'),
            inline: true
        }
    });
    let report_fields = [{
        name: 'Replay ID',
        value: match.id,
        inline: true
    },{
        name: 'Host',
        value: match.host.login,
        inline: true
    },{
        name: 'Ranked',
        value: match.validity === 'VALID' ? 'Yes' : 'No - ' + match.validity,
        inline: true
    },{
        name: 'Game Type (Featured Mod)',
        value: match.featured_mod,
        inline: true
    },{
        name: 'Victory Condition',
        value: match.victoryCondition,
        inline: true
    },{
        name: 'Size',
        value: size,
        inline: true
    },{ name: '\u200B', value: '\u200B' },...team_fields];
    let embed = {
        description: match.map.description,
        fields: report_fields,
        image: {
            url: encodeURI(match.map.thumbnailUrlLarge)
        },
    };
    // if (match.map.thumbnailUrlLarge) {
    //     embed.thumbnail = {url: encodeURI(match.map.thumbnailUrlLarge)};
    // }
    return embed;
}

/**
 * Get player discord ids for a faf match.
 * @param match
 * @param guild_id
 * @param active_channel optional, if you pass this in it will match by name
 * @returns {Promise<Array>}
 */
let getDiscordIdsFromMatch = async (match, guild_id, active_channel = null) => {
    let discord_ids = [];
    console.log('getting discord ids')
    await helper.processArray(match.teams, async function(team){
        await helper.processArray(team.players, async player => {
            console.log('processing player')
            let found = false;
            let player_ids = helper.getObjectValues(team.players, 'id')
            console.log('player_ids', player_ids)
            let faf_users = await fafUserModel.findAll({ where: {
                faf_id: player_ids,
                guild_id: guild_id
            }});
            if (faf_users && faf_users.length) {
                await helper.processArray(faf_users, faf_user => {
                    if (parseInt(faf_user.faf_id) === parseInt(player.id)) {
                        found = true;
                        console.log('found it!', faf_user.discord_id)
                        discord_ids.push(faf_user.discord_id)
                    }
                })
            }
            if (!found && active_channel) {
                await helper.processArray(active_channel.members.array(),member => {
                    if (member.displayName.toLowerCase() === player.name.toLowerCase()) {
                        console.log('found match by name!', player.name)
                        discord_ids.push(member.id)
                        fafUserModel.create({
                            discord_id: member.id,
                            guild_id: guild_id,
                            faf_id: player.id
                        });
                    }
                })
            }
        })
    })
    return discord_ids;
}

let sortFafMatch = async (client, guild_id, match_id, active_channel) => {
    let match;
    try{
        match = await getMatch(match_id);
        if (match && match.teams && match.teams.length) {
            console.log('got match data')
            await helper.processArray(match.teams, async function(team){
                let channel_name = `Team ${team.team} - ${match.name} (temp)`
                if (team.team === 0) {
                    channel_name = `No Team - ${match.name} (temp)`
                }
                let discord_ids = await getDiscordIdsFromMatch(match, guild_id, active_channel)
                console.log(discord_ids)
                if (discord_ids.length) {
                    let channel = await active_channel.guild.channels.create(channel_name, {
                        type: 'voice',
                        reason: 'temp channel for a FAF game',
                        parent: active_channel.parentID
                    });
                    console.log('creating channel: ' + channel_name)
                    await helper.processArray(discord_ids, async function(discord_id){
                        helper.moveUser(client, guild_id, discord_id, channel.id);
                    })
                }
            });
        }
    } catch(e) {
        console.log('getFafId err', e);
    }
    return match;
}

let getFafId = async author => {
    let faf_id;
    try{
        let user = await fafUserModel.findOne({where: {discord_id: author.id}});
        if (user) {
            faf_id = user.faf_id;
        } else {
            let faf_id = await searchUser(author.username);
            if (faf_id) {
                fafUserModel.create({
                    discord_id: msg.author.id,
                    guild_id: msg.guild.id,
                    faf_id: faf_id
                });
            }
        }
    } catch(e) {
        console.log('getFafId err', e);
    }
    return faf_id;
}
module.exports = {
    getDiscordIdsFromMatch,
    getFafId,
    sortFafMatch,
    getPlayerCurrentMatch,
    searchUser,
    getMatch,
    getMatchEmbed
}
