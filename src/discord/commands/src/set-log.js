let helper = require('../../../common/helper');
const models = require('../../../../models');
const Guild = models.Guild;

async function onMessage(msg, client){
    try {
        if (!msg.member.permissions.has('ADMINISTRATOR')) {
            return msg.reply("You must be an admin to run that.")
        } else {
            let guild = await Guild.findOne({where: {guild_id: msg.guild.id}});
            let data = {
                match_log_channel_id: msg.channel.id,
            }
            let res = await guild.update(data)
            msg.reply('Log channel set')
        }
    } catch (e) {
        console.log('err in listen command: ', e);
    }
}

module.exports = {
    name: 'log here',
    description: 'Set the log channel for matches',
    check: content => {
        return content.match(/^log here/)
    },
    run: onMessage
}