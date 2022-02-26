import { DataTypes, Model, Optional, Sequelize } from "sequelize";

interface GuildJoinAttributes {
    discord_id: string;
    guild_id: string;
    join_date: string;
    leave_date: string;
}
// Some fields are optional when calling GuildJoinModel.create() or GuildJoinModel.build()
interface GuildJoinCreationAttributes extends Optional<GuildJoinAttributes, "discord_id"> {}

// We need to declare an interface for our model that is basically what our class would be
interface GuildJoinInstance
  extends Model<GuildJoinAttributes, GuildJoinCreationAttributes>,
    GuildJoinAttributes {};
    
export default (sequelize: Sequelize) => {
    const GuildJoin = sequelize.define('GuildJoin', {
        discord_id: DataTypes.STRING,
        guild_id: DataTypes.STRING,
        join_date: DataTypes.DATE,
        leave_date: DataTypes.DATE,
    }, {});
    return GuildJoin;
};
