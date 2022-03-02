import { SlashCommandBuilder } from '@discordjs/builders';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import config from '../config';
import commands, { Command } from './commands';

const rest = new REST({ version: '9' }).setToken(config.discordToken);

const buildSlash = (appCommands: `/applications/${string}/guilds/${string}/commands`) => async ({name, description}: Command) => {
  rest.put(
    appCommands,
    {
      body: new SlashCommandBuilder()
        .setName(name)
        .setDescription(description)
        .toJSON(),
    },
  );
}

const register = async (clientId: string, guildId: string) => {
  const appCommands = Routes.applicationGuildCommands(clientId, guildId);
  await Promise.all(commands.map(buildSlash(appCommands)));
  console.log('registered commands');
}

export default register;
