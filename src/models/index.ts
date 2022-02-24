require("dotenv").config();
import fs from 'fs';
import path from 'path';
import Sequelize from 'sequelize';
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require('../config')[env];


let sequelize = new Sequelize(config.database, config.username, config.password, config);

const FafUser = require('./fafuser')(sequelize)
const Guild = require('./guild')(sequelize)
const GuildJoin = require('./guildjoin')(sequelize)

export default {
    connection: {
      sequelize,
      Sequelize
    },
    FafUser: FafUser,
    Guild: Guild,
    GuildJoin: GuildJoin,
};
