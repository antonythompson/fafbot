const perms =require('discord-permissions')

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
    let link = perms.generateInvite(process.env.DISCORD_CLIENT_ID, perms);
    msg.reply(link)
}

module.exports = {
    name: 'invite',
    help: 'Replies with a link to invite this bot to another discord server.',
    check: content => content.match(/^invite(.+)/),
    run: onMessage
}