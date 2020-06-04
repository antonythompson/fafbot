const axios = require('axios');
let helper = require('../common/helper')
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
            let matchData = res.data;
            match = matchData.data.attributes;
            match.id = matchData.data.id;
            console.log('inside after');
            console.log(match);
            let player_in_team = {};
            let query = '';
            await helper.processArray(res.data.included,item => {
                console.log(item);
                if (item.type === 'gamePlayerStats') {
                    let player_id = item.relationships.player.data.id;
                    player_in_team[player_id] = item.attributes.team;
                    query = query + 'id==' + player_id;
                } else if (item.type === 'mapVersion') {
                    match.map = item.attributes;
                }
            })
            let url = `https://api.faforever.com/data/player?filter=${query}&page[size]=16`
            let player_res = await axios.get(url);
            let teams = {};
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

module.exports = {
    getPlayerCurrentMatch: getPlayerCurrentMatch,
    searchUser: searchUser,
    getMatch: getMatch,
}