
let helper = require('../common/helper');
const Discord = require('discord.js');
const client = new Discord.Client();
const eventHandlers = require('./event-handlers')

function start(){

    client.on('ready', () => {
        console.log(`Logged in as ${client.user.tag}!`);
    });
    client.on('message', eventHandlers.onMessage);
    client.on('voiceStateUpdate', eventHandlers.onVoiceStateUpdate);
    client.on("guildCreate", eventHandlers.onGuildCreate)
    client.on("guildDelete", eventHandlers.onGuildDelete)
    client.on("guildMemberAdd", eventHandlers.onGuildMemberAdd)
    client.on("guildMemberRemove", eventHandlers.onGuildMemberRemove)
    client.login(process.env.DISCORD_TOKEN);

}


module.exports = {
    start: start
};