import { Command } from '.';
import faf from '../../faf-api';

function onMessage(msg){
    let game_id = msg.activity.partyID
    console.log('gameid', game_id);
}

const out: Command = {
    check: (_, msg) => {
        return msg
            && msg.applicationId === '464069837237518357'
            && msg.activity
            && msg.activity.partyId;
    },
    help: '',
    name: 'fafPresence',
    run: onMessage,
    description: ''
}

export default out;