import checksetup from "./checksetup";
import setLog from "./set-log";
import setUser from "./set-user";
import sort from "./sort";
import invite from "./invite";
import clanInvite from "./clan-invite";
import testPuppeteer from "./test-puppeteer";
import { Message, CacheType, MessageComponentInteraction, Client } from "discord.js";


const out = [
    checksetup,
    setLog,
    setUser,
    sort,
    invite,
    clanInvite,
    testPuppeteer,
];

export interface Command {
    name: string;
    help: string;
    description: string;
    check: (content: string, msg?: Message) => any;
    run: (msg: Message<true>, client: Client) => any;
}

export default out;
