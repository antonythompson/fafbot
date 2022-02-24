
let helper = require('/common/helper');
const { Client, Intents } = require('discord.js');
const client = new Client({intents: [
    Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.DIRECT_MESSAGES,
    Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_VOICE_STATES,
]});
const eventHandlers = require('./event-handlers')

function start(){

    client.on('ready', () => {
        console.log(`Logged in as ${client.user.tag}!`);
        // const channel = client.channels.cache.get("720187277355122769");
    });
    client.on('messageCreate', eventHandlers.onMessage);
    client.on('voiceStateUpdate', eventHandlers.onVoiceStateUpdate);
    // client.on("guildCreate", eventHandlers.onGuildCreate);
    // client.on("guildDelete", eventHandlers.onGuildDelete);
    // client.on("guildMemberAdd", eventHandlers.onGuildMemberAdd);
    // client.on("guildMemberRemove", eventHandlers.onGuildMemberRemove);
    // console.log("Token:", process.env.DISCORD_TOKEN);
    client.login(process.env.DISCORD_TOKEN);

}


module.exports = {
    start: start
};
