import { Client, Message } from 'discord.js';
import { Command } from '.';
import helper from '../../common/helper';

async function onMessage(msg: Message<true>, client: Client){
    try {
        let channel = await msg.channel.guild.channels.create('Team 1 (temp)', {
            type: 'GUILD_VOICE',
            reason: 'temp channel for a FAF game'
        });
        await helper.moveUser(client, msg.channel.guild, msg.author.id,channel.id);
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