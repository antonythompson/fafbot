let commands = require('./commands/commands');
let helper = require('../common/helper');
const Discord = require('discord.js');
const client = new Discord.Client();

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
async function onMessage(msg){
    try {
        if (msg.author.bot || !msg.content.match(/^f\/(.+)/) || await checkHelp(msg)) return;
        console.log('message received');
        console.log(msg.content, 'from: ', msg.author.username);
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

async function checkHelp(msg){
    try{
        if (msg.content.match(/^f\/help(.+)?/)) {
            let messages = []
            let commandCheck = msg.content.match(/^f\/help(.+)/)
            let userCommand = commandCheck && commandCheck[1] ? commandCheck[1].trim() : null;
            let command_help = false;
            await helper.processArray(commands, (command, index) => {
                let is_command_valid = command && command.description && command.help && command.name
                if (is_command_valid) {
                    console.log('checking', command);
                    if (command.name === userCommand) {
                        console.log('command found', command.name);
                        command_help = command;
                    } else if (!userCommand) {
                        messages.push({
                            name: command.name,
                            value: command.description,
                            inline: true
                        });
                    }
                }
            });
            let message;
            console.log('help', command_help)
            if (userCommand) {
                if (!command_help) {
                    message = `Couldn't find command \`${userCommand}\``;
                } else {
                    message = {
                        embed: {
                            title: 'Command help - ' + command_help.name,
                            description: command_help.help,
                        }
                    };
                }
            } else {
                message = {
                    embed: {
                        title: 'Available commands',
                        description: 'All the available commands are below. For more info on each command use the help command\n eg: `f/help set`',
                        fields: messages,
                    }
                };
            }
            msg.channel.send(message)
            return true;
        } else {
            return false;
        }
    } catch (e) {
        console.warn(e)
    }
}

module.exports = {
    start: start
};