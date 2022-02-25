import { config } from 'dotenv';
import discord from './discord';


config();

discord.start();
