import { DataTypes, Model, Optional, Sequelize } from "sequelize";

interface GuildAttributes {
    guild_id: string;
    name: string;
    description: string;
    icon: string;
    banner: string;
    region: string;
    match_log_channel_id: string;
}
// Some fields are optional when calling GuildModel.create() or GuildModel.build()
interface GuildCreationAttributes extends Optional<GuildAttributes, "guild_id"> {}

// We need to declare an interface for our model that is basically what our class would be
interface GuildInstance
  extends Model<GuildAttributes, GuildCreationAttributes>,
    GuildAttributes {};

export default (sequelize: Sequelize) => {
    const Guild = sequelize.define<GuildInstance>('Guild', {
        guild_id: DataTypes.STRING,
        name: DataTypes.STRING,
        description: DataTypes.TEXT,
        icon: DataTypes.STRING,
        banner: DataTypes.STRING,
        region: DataTypes.STRING,
        match_log_channel_id: DataTypes.STRING,
    }, {});
    return Guild;
};
