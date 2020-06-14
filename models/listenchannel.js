'use strict';
module.exports = (sequelize, DataTypes) => {
    const ListenChannel = sequelize.define('ListenChannel', {
        channel_id: DataTypes.STRING,
        guild_id: DataTypes.STRING,
    }, {});
    ListenChannel.associate = function (models) {
        // associations can be defined here
    };
    return ListenChannel;
};