
const Apify = require('apify');

async function onMessage(msg){
    let name;
    try{
        let name_result = msg.content.match(/^f\/clan(.+)/)
        if (name_result && name_result[1]) {
            name = name_result[1].trim();

            (async () => {

                const browser = await Apify.launchPuppeteer({
                    "headless": true,
                    args: ['--no-sandbox']
                });
                const page = await browser.newPage();
                await page.goto('https://faforever.com/login');
                const usernameEl = await page.$('#username');
                await usernameEl.type(process.env.FAF_CLAN_USERNAME);
                const passwordEl = await page.$('#password');
                await passwordEl.type(process.env.FAF_CLAN_PASSWORD);
                await passwordEl.press('Enter');
                await page.waitForNavigation();

                // Get cookies
                const cookies = await page.cookies();

                // Use cookies in other tab or browser
                const page2 = await browser.newPage();
                await page2.setCookie(...cookies);
                await page2.goto('https://www.faforever.com/clans/manage'); // Opens page as logged user

                const clanUserEl = await page2.$('[name="invited_player"]');
                await clanUserEl.type(name);
                await clanUserEl.press('Enter');
                await page2.waitForNavigation();
                let url = page2.url();

                let failed = true;
                if (url.indexOf('invitation') !== -1) {
                    let invitation_id = url.match(/invitation_id=(.+)/)
                    if (invitation_id && invitation_id[1]) {
                        msg.reply(`https://www.faforever.com/clans/accept?i=${invitation_id[1]}`);
                        failed = false
                    }
                }
                if (failed) {
                    msg.reply('There was a problem generating an invite for `' + name + '` please check that username is correct, otherwise maybe @antz needs to generate one manually.')
                }

                await browser.close();
            })();
        }
    } catch (e) {
        console.log('clan error', {
            name,
            author: msg.author.id,
            guild: msg.guild.id
        }, e)
    }
}

module.exports = {
    name: 'clan',
    description: 'Generate a clan invite link.',
    help: 'This will generate a clan invite link for you. \nUsage: `f/clan username`',
    check: content => content.match(/^clan(.+)/),
    run: onMessage
}