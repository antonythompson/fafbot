const axios = require('axios');
let helper = require('/common/helper')
let getPlayerCurrentMatch = async player_id => {
    // Actually gets the most recent match, which might be ended.
    let result;
    try{
        let url = `https://api.faforever.com/data/gamePlayerStats?include=game&filter=player.id==${player_id}&sort=-id&page[size]=1`
        let res = await axios.get(url)
        console.log('getPlayerCurrentMatch got something...');
        // console.log(res.data.included[0]);
        if (res.data && res.data.included
            && res.data.included[0]
            && res.data.included[0].attributes
        ) {
            // && res.data.included[0].attributes.endTime === null) {
            result = res.data.included[0];
            console.log("... found match", result.id, "named", result.attributes.name);
        }
    } catch (e) {
        console.log('err in searchUser', e);
    }
    if (result) {
        console.log('getPlayerCurrentMatch(', player_id, ') returns match with id', result.id, 'name', result.attributes.name);
    } else {
        console.log('Player', player_id, 'not in a match?')
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
            console.log('searched for match id', match_id, 'found match', match.id);
            let player_in_team = {};
            let query = '';
            await helper.processArray(res.data.included,item => {
                // console.log(item);
                if (item.type === 'gamePlayerStats') {
                    let player_id = item.relationships.player.data.id;
                    let team_no = item.attributes.team - 1;
                    player_in_team[player_id] = team_no;
                    console.log("game has player", player_id, "in team", team_no);
                    if (query === '') {
                        query = query + 'id==' + player_id;
                    } else {
                        query = query + ',id==' + player_id;
                    }
                } else if (item.type === 'mapVersion') {
                    match.map = item.attributes;
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

export default {
    getPlayerCurrentMatch: getPlayerCurrentMatch,
    searchUser: searchUser,
    getMatch: getMatch,
}
