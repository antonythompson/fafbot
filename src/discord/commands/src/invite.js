const permManager =require('discord-permissions')

/**
 *
 * @param msg
 * @returns {Promise<void>}
 */
async function onMessage(msg){
    let perms = [
        /** --------/ General /----* */
        // 'Administrator',
        // 'View Audit Log',
        // 'View Server Insights',
        // 'Manage Server',
        // 'Manage Roles',
        'Manage Channels',
        // 'Kick Members',
        // 'Ban Members',
        // 'Create Instant Invite',
        // 'Change Nickname',
        // 'Manage Nicknames',
        // 'Manage Emojis',
        // 'Manage Webhooks',
        'View Channels',
        /** --------/ Text /----* */
        'Send Messages',
        // 'Send TTS Messages',
        // 'Manage Messages',
        // 'Embed Links',
        // 'Attach Files',
        // 'Read Message History',
        // 'Mention Everyone',
        // 'Use External Emojis',
        'Add Reactions',
        /** --------/ Voice /----* */
        // 'Connect',
        // 'Speak',
        // 'Mute Members',
        // 'Deafen Members',
        'Move Members',
        // 'Use Voice Activity',
        // 'Priority Speaker',
    ];
    let client_id = process.env.DISCORD_CLIENT_ID;
    console.log('check key', client_id, client_id.match(/[0-9]{16,20}/))
    let link = permManager.generateInvite(client_id, perms);
    console.log(link);
    msg.reply(link)
}

module.exports = {
    name: 'invite',
    description: 'Replies with the bot invite link.',
    help: 'Replies with an invite link. This might be needed if you need to re-invite the bot to add latest permissions. \nUsage: `f/invite`',
    check: content => content.match(/^invite$/),
    run: onMessage
}