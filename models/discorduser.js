'use strict';
module.exports = (sequelize, DataTypes) => {
    const DiscordUser = sequelize.define('DiscordUser', {
        discord_id: DataTypes.STRING,
        guild_id: DataTypes.STRING,
        name: DataTypes.STRING,
        join_date: DataTypes.DATE,
    }, {});
    DiscordUser.associate = function (models) {
        // associations can be defined here
    };
    return DiscordUser;
};