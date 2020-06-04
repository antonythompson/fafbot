'use strict';
module.exports = (sequelize, DataTypes) => {
    const FafUser = sequelize.define('FafUser', {
        faf_id: DataTypes.INTEGER,
        discord_id: DataTypes.STRING,
        guild_id: DataTypes.STRING,
    }, {});
    FafUser.associate = function (models) {
        // associations can be defined here
    };
    return FafUser;
};