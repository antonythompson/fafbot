import { Command } from '.';
import helper from '../../common/helper';
import models from '../../models';
const Guild = models.Guild;

async function onMessage(msg, client){
    try {
        if (!msg.member.permissions.has('ADMINISTRATOR')) {
            return msg.reply("You must be an admin to run that.")
        } else {
            let guild = await Guild.findOne({where: {guild_id: msg.guild.id}});
            if (!guild) {
                guild = await helper.findOrCreateGuild(msg.guild);
            }
            let guild_added = guild ? 'yes' : 'no'
            let added = await helper.addGuildMembers(msg.guild);
            let message = `Guild added: ${guild_added} \n Member Joins added: ${added}`
            msg.reply(message)
        }
    } catch (e) {
        console.log('err in listen command: ', e);
    }
}

const out: Command = {
    name: 'checksetup',
    help: '',
    description: 'Check the setup for the bot',
    check: content => {
        return content.match(/^checksetup/)
    },
    run: onMessage
}

export default out;