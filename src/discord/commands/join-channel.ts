import https from 'https';
import { Command } from '.';
const helper = require('../../common/helper')
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

const out: Command = {
    check: content => content.match(/^join(.+)?/),
    help: '',
    description: '',
    run: onMessage,
    name: ''
}

export default out;