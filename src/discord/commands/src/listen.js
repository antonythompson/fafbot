const permManager =require('discord-permissions')
let helper = require('../../../common/helper');
const models = require('../../../../models');
const ListenChannel = models.ListenChannel;
const {table} = require('table');

async function onMessage(msg, client){
    try {
        if (!msg.member.permissions.has('ADMINISTRATOR')) {
            return msg.reply("You must be an admin to run that.")
        } else {
            let active_channel = await helper.getUserActiveVoiceChannel(client, msg.author.id, msg.guild.id);
            if (!active_channel) {
                return msg.channel.send(`You must be in a voice channel to run that command.`);
            }
            let command = msg.content.replace('f\/listen', '').trim();
            console.log(command);
            switch (command) {
                case 'remove':
                    await remove(msg, active_channel);
                    break;
                case 'add':
                    await add(msg, active_channel);
                    break;
                case 'list':
                default:
                    await list(msg, client, active_channel);
                    break;
            }
        }
    } catch (e) {
        console.log('err in listen command: ', e);
    }
}

async function list(msg, client, active_channel){
    let channels = await ListenChannel.findAll({where: {
        guild_id: msg.guild.id
    }});
    let guild = await client.guilds
        .resolve(msg.channel.guild.id);
    let found = false;
    let data = [['Category', 'Channel']];
    if (channels && channels.length) {
        await helper.processArray(channels, async channel => {
            let g_channel = await guild.channels.resolve(channel.channel_id);
            if (g_channel) {
                found = true;
                data.push([g_channel.parent.name, g_channel.name])
                // reply += `\n${g_channel.parent.name}/${g_channel.name}`
            } else {
                //clean up deleted channel
                ListenChannel.destroy({where: {
                    guild_id: msg.guild.id,
                    channel_id: channel.channel_id
                }});
            }
        })
    }
    if (found) {
        let reply = "Here's the list of channels i'm currently listening to: \n";
        let options = {
            drawHorizontalLine: (index, size) => {
                return index === 0 || index === 1 || index === size;
            }
        };
        let table_content = table(data, options)
        msg.reply('```' + table_content + '```');
    } else {
        msg.reply("I'm not listening to any channels. Run `f/help listen` to find out how to manage your channels")
    }
}

async function add(msg, active_channel){
    let channel = await ListenChannel.findOne({where: {
        guild_id: msg.guild.id,
        channel_id: active_channel.id
    }});
    if (!channel) {
        let create = await ListenChannel.create({
            guild_id: msg.guild.id,
            channel_id: active_channel.id
        });
        msg.reply("I'll listen to `" + active_channel.name + '` from now on')
        console.log('created', create)
    } else {
        msg.reply("I'm already listening to channel:  `" + active_channel.name + '`')
    }
    console.log(channel);
}
async function remove(msg, active_channel){
    let channel = await ListenChannel.findOne({where: {
        guild_id: msg.guild.id,
        channel_id: active_channel.id
    }});
    if (channel) {
        ListenChannel.destroy({where: {
            guild_id: msg.guild.id,
            channel_id: active_channel.id
        }});
        msg.reply(`I've removed \`${active_channel.name}\` from the list.`)
    } else {
        msg.reply("I'm not listening for that channel")
    }
    console.log(channel);
}

module.exports = {
    name: 'listen',
    description: 'Sets your current voice channel to listen for games to auto sort',
    help: 'Sets your current voice channel to listen for games to auto sort. ' +
        'This means you won\'t need to run f/sort. \n' +
        'You must be the server admin to run this.  \n' +
        'Usage:\n `f/listen` - Lists the channels being listened to.\n' +
        '`f/listen add` - Adds your current voice channel.\n' +
        '`f/listen remove` - Removes your current voice channel.\n',
    check: content => {
        return content.match(/^listen( list)?( remove)?/)
    },
    run: onMessage
}