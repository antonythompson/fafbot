let faf = require('../../../faf-api');

function onMessage(msg){
    let game_id = msg.activity.partyID
    console.log('gameid', game_id);
}

export default {
    check: (content, msg) => {
        return msg.application
            && msg.application.id === '464069837237518357'
            && msg.activity
            && msg.activity.partyID;
    },
    run: onMessage
}