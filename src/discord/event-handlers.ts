let helper = require('/common/helper');
let commands = require('./commands');
const models = require('/models');
const GuildJoin = models.GuildJoin
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const { MessageEmbed } = require('discord.js');

function onVoiceStateUpdate(oldThing, newThing){
    //delete temp channels we create when there's nobody in them.
    if (!(oldThing && oldThing.channel)) { return; }
    if (!oldThing.channel.name.match(/\(temp\)/)) { return; }
    // console.log("Channel:", oldThing.channel.name, "member count:", oldThing.channel.members.size, "deletable?", oldThing.channel.deletable);
    // if (newThing && oldThing.channelId === newThing.channelId) { return; }
    if (!oldThing.channel.deletable) { return; }
    if (oldThing.channel.members.size === 0) {
        if (! oldThing.guild.channels.cache.find(channel => channel.id === oldThing.channel.id)) {
            console.log("Channel no exist no more?");
            return;
        }
        console.log("VoiceStateUpdate: deleting channel", oldThing.channel.id, 'name', oldThing.channel.name);
        try {
            oldThing.channel.delete();
        } catch (e) {
            console.log('Error on deleting channel', oldThing.channel.id, ':', e);
        }
    }
}

async function onGuildMemberAdd(member) {
    try{
        if (!member.user.bot) {
            let data = {
                join_date: new Date(member.joinedTimestamp),
                discord_id: member.user.id,
                guild_id: member.guild.id,
            }
            await GuildJoin.create(data)
        }
    } catch (e) {
        console.log('error in onGuildCreate', e)
    }
}
async function onGuildMemberRemove(member) {
    try{
        let mem = await GuildJoin.findOne({
            where: {
                discord_id: member.user.id,
                guild_id: member.guild.id,
                leave_date: {
                    [Op.is]: null
                }
            },
            order: [['join_date', 'desc']]
            // order: 'join_date desc'
        })
        if (mem) {
            let leave_date = new Date()
            mem.set({leave_date});
            mem.save();
        }
    } catch (e) {
        console.log('error in onGuildCreate', e)
    }
}
async function onGuildCreate(guild) {
    try{
        console.log("Joined a new guild: " + guild.name);
        let db_guild = await helper.findOrCreateGuild(guild)
        await helper.addGuildMembers(guild)
        console.log('Members added to DB')
    } catch (e) {
        console.log('error in onGuildCreate', e)
    }
}
async function onGuildDelete(guild) {
    try{
        console.log("Joined a new guild: " + guild.name);
        let db_guild = await helper.findOrCreateGuild(guild)
        await helper.addGuildMembers(guild)
        console.log('Members added to DB')
    } catch (e) {
        console.log('error in onGuildCreate', e)
    }
}

async function onMessage(msg){
    try {
        if (msg.author.bot || !msg.content.match(/^f\/(.+)/) || await checkHelp(msg)) return;
        const now = new Date();
        console.log(now.toLocaleString("en-AU"), ': received', msg.content, 'from:', msg.author.username);
        let done = false;
        helper.processArray(commands, function(command){
            if (done) return;  // ``
            let content = msg.content.match(/^f\/(.+)/)[1];
            if (command.check(content, msg)) {
                console.log(content, 'command matched');
                command.run(msg, msg.client);
                done = true;
            }
        });
    } catch (e) {
        console.log('error in ' + __filename, e);
    }
}

async function checkHelp(msg){
    try{
        if (! msg.content.match(/^f\/help(.+)?/)) {
            return false;
        }
        let messages = []
        let commandCheck = msg.content.match(/^f\/help(.+)/)
        let userCommand = commandCheck && commandCheck[1] ? commandCheck[1].trim() : null;
        let command_help = false;
        await helper.processArray(commands, (command, index) => {
            let is_command_valid = command && command.description && command.help && command.name
            if (is_command_valid) {
                if (command.name === userCommand) {
                    command_help = command;
                } else if (!userCommand) {
                    // messages.push({
                    //     name: command.name,
                    //     value: command.description,
                    //     inline: true
                    // });
                    messages.push(command.name);
                }
            }
        });
        let embed = new MessageEmbed().setTimestamp().setColor('#DDCC00');
        console.log(`help (command help is ${command_help})`);
        if (userCommand) {
            if (!command_help) {
                msg.channel.send("Couldn't find command '" + userCommand + "'");
                return true;
            } else {
                msg.channel.send("Command help: " + command_help.help);
                return true;
                embed.setTitle('Command help - ' + command_help.name);
                embed.setDescription(command_help.help);
            }
        } else {
            msg.channel.send("Available commands: " + messages.join(', '));
            return true;
            embed.setTitle('Available commands');
            embed.setDescription('All the available commands are below. For more info on each command use the help command\n eg: `f/help set`');
            // embed.addFields(messages);
        }
        // console.log('Channel permissions for bot:', msg.channel.permissionsFor(msg.guild.me).toArray());
        msg.channel.send({ embeds: [embed] });
        return true;
    } catch (e) {
        console.warn(e)
    }
}

export default {
    onMessage,
    onGuildDelete,
    onVoiceStateUpdate,
    onGuildCreate,
    onGuildMemberAdd,
    onGuildMemberRemove,
}
