import { DataTypes } from "sequelize";

export default (sequelize) => {
    const GuildJoin = sequelize.define('GuildJoin', {
        discord_id: DataTypes.STRING,
        guild_id: DataTypes.STRING,
        join_date: DataTypes.DATE,
        leave_date: DataTypes.DATE,
    }, {});
    GuildJoin.associate = function (models) {
        // associations can be defined here
    };
    return GuildJoin;
};
