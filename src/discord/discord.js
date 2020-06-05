let commands = require('./commands/commands');
let helper = require('../common/helper');
const Discord = require('discord.js');
const client = new Discord.Client();
console.log('discord commnads', commands)

function start(){

    client.on('ready', () => {
        console.log(`Logged in as ${client.user.tag}!`);
    });
    client.on('message', onMessage);
    client.on('voiceStateUpdate', onVoiceStateUpdate);
    client.login(process.env.DISCORD_TOKEN);

}

function onVoiceStateUpdate(oldThing, newThing){
    //delete temp channels we create when there's nobody in them.
    if (oldThing
        && oldThing.channel
        && oldThing.channel.name.match(/\(temp\)/)
        && !oldThing.channel.members.array().length) {
        oldThing.channel.delete();
    }
}
function onMessage(msg){
    try {
        console.log('message received');
        console.log(msg.content, 'from: ', msg.author.username);
        if (msg.author.bot || !msg.content.match(/^f\/(.+)/) || checkHelp(msg)) return;
        let done = false;
        helper.processArray(commands, function(command){
            if (done) return;
            let content = msg.content.match(/^f\/(.+)/)[1];
            console.log('checking', content, command);
            if (command.check(content, msg)) {
                console.log('checked ok');
                command.run(msg, client);
                done = true;
            }
        });
    } catch (e) {
        console.log('error in ' + __filename, e);
    }
}

function checkHelp(msg){
    if (msg.content.match(/^f\/help(.+)?/)) {
        let messages = []
        console.log(commands);
        commands.forEach((command, index)=> {
            if (command && command.help && command.name) {
                messages.push({
                    name: command.name,
                    value: command.help,
                    inline: true
                });
            }
        });
        let embed = {
            title: 'Available commands',
            description: '',
            fields: messages,
            timestamp: new Date(),
        };
        msg.channel.send({embed})
        return true;
    } else {
        return false;
    }
}

module.exports = {
    start: start
};