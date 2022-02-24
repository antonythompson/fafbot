let faf = require('../../../faf-api');
const models = require('../../../../models');
const FafUser = models.FafUser;

async function onMessage(msg){
    let name_result = msg.content.match(/^f\/set(.+)/)
    if (name_result && name_result[1]) {
        let name = name_result[1].trim();
        let faf_id = await faf.searchUser(name);
        let user;
        if (faf_id) {
            user = await FafUser.findOne({ where: {
                    discord_id: msg.author.id,
                    guild_id: msg.guild.id
                }});
            if (user) {
                user.update({
                    discord_id: msg.author.id,
                    guild_id: msg.guild.id,
                    faf_id: faf_id
                })
            } else {
                user = await FafUser.create({ where: {
                        discord_id: msg.author.id,
                        guild_id: msg.guild.id,
                        faf_id: faf_id
                    }});
            }
            if (user) {
                msg.reply('Your faf login has been set')
            } else {
                msg.reply('There was a problem saving your login')
            }
        } else {
            msg.reply('I could not find your faf login.')
        }
    }
}

module.exports = {
    name: 'set',
    description: 'Set the category channels should be created in.`',
    help: 'Set the category channels should be created in`  \nUsage: `f/setcategory <name>`',
    check: content => content.match(/^setcategory(.+)/),
    run: onMessage
}