'use strict';

const { Sequelize, DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const FafUser = sequelize.define('FafUser', {
        faf_id: Sequelize.INTEGER,
        discord_id: Sequelize.STRING,
        guild_id: Sequelize.STRING,
	discord_username: Sequelize.STRING,
    }, {});
    FafUser.associate = function (models) {
        // associations can be defined here
    };
    return FafUser;
};
