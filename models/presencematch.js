'use strict';
module.exports = (sequelize, DataTypes) => {
    const PresenceMatch = sequelize.define('PresenceMatch', {
        channel_id: DataTypes.STRING,
        guild_id: DataTypes.STRING,
        faf_id: DataTypes.STRING,
    }, {});
    PresenceMatch.associate = function (models) {
        // associations can be defined here
    };
    return PresenceMatch;
};