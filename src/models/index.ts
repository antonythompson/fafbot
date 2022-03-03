import { Sequelize } from 'sequelize';
import Config from '../config';
import FafUser from './fafuser';
import Guild from './guild';
import GuildJoin from './guildjoin';

const config = Config;

require("dotenv").config();
const db = {};

let sequelize = new Sequelize(config.database, config.username, config.password, config);

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

export default {
    FafUser: FafUser(sequelize),
    Guild: Guild(sequelize),
    GuildJoin: GuildJoin(sequelize),
};
