const https = require('https');
const helper = require('../../../common/helper')
async function onMessage(msg, client){
    try {
        let channel = await msg.channel.guild.channels.create('Team 1 (temp)', {
            type: 'voice',
            reason: 'temp channel for a FAF game'
        });
        helper.moveUser(client, msg.channel.guild.id, msg.author.id,channel.id);
    } catch (e) {
        console.log(e, '^^^ join channel err');
    }
}

module.exports = {
    check: content => content.match(/^join(.+)?/),
    run: onMessage
}