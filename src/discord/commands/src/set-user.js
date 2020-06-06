let faf = require('../../../faf-api');
const models = require('../../../../models');
const FafUser = models.FafUser;

async function onMessage(msg){
    let faf_id,name,user;
    try{
        let name_result = msg.content.match(/^f\/set(.+)/)
        if (name_result && name_result[1]) {
            name = name_result[1].trim();
            faf_id = await faf.searchUser(name);
            if (faf_id) {
                user = await FafUser.findOne({
                    discord_id: msg.author.id,
                    guild_id: msg.guild.id
                });
                console.log('user', user)
                if (user) {
                    user.update({
                        discord_id: msg.author.id,
                        guild_id: msg.guild.id,
                        faf_id: faf_id
                    })
                } else {
                    user = await FafUser.create({
                        discord_id: msg.author.id,
                        guild_id: msg.guild.id,
                        faf_id: faf_id
                    });
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
    } catch (e) {
        console.log('set error', {
            faf_id,
            name,
            user,
            author: msg.author.id,
            guild: msg.guild.id
        }, e)
    }
}

module.exports = {
    name: 'set',
    description: 'Set your faf login if different to discord.',
    help: 'Sets your faf name in the bot for automatic channel sorting. \nUsage: `f/set <name>`',
    check: content => content.match(/^set(.+)/),
    run: onMessage
}