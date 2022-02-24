

const { Sequelize, DataTypes } = require("sequelize");

export default (sequelize) => {
    const Guild = sequelize.define('Guild', {
        guild_id: DataTypes.STRING,
        name: DataTypes.STRING,
        description: DataTypes.TEXT,
        icon: DataTypes.STRING,
        banner: DataTypes.STRING,
        region: DataTypes.STRING,
        match_log_channel_id: DataTypes.STRING,
    }, {});
    Guild.associate = function (models) {
        // associations can be defined here
    };
    return Guild;
};
