let helper = require('../../../common/helper');
const models = require('../../../../models');
const DiscordUser = models.DiscordUser;

async function onMessage(msg, client){
    try {
        if (!msg.member.permissions.has('ADMINISTRATOR')) {
            return msg.reply("You must be an admin to run that.")
        } else {
            console.log('member count', msg.guild.members.cache.array().length)
            await helper.processArray(msg.guild.members.cache.array(), async member => {
                if (!member.user.bot) {
                    console.log(new Date(member.joinedTimestamp));
                    let data = {
                        discord_id: member.user.id,
                        guild_id: member.guild.id,
                        name: member.user.username,
                        join_date: new Date(member.joinedTimestamp),
                    };
                    console.log(data);
                    await DiscordUser.create(data)
                }
            })
            console.log('member count', msg.guild.members.cache.array().length)
        }
    } catch (e) {
        console.log('err in listen command: ', e);
    }
}

module.exports = {
    name: 'countusers',
    description: 'Counts the users and puts them in the DB',
    check: content => {
        return content.match(/^countusers/)
    },
    run: onMessage
}