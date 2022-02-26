import { DataTypes, Model, Optional, Sequelize } from "sequelize";

interface UserAttributes {
    faf_id: number;
    discord_id: string;
    guild_id: string;
    discord_username: string;
}
// Some fields are optional when calling UserModel.create() or UserModel.build()
interface UserCreationAttributes extends Optional<UserAttributes, "faf_id"> {}

// We need to declare an interface for our model that is basically what our class would be
interface UserInstance
  extends Model<UserAttributes, UserCreationAttributes>,
    UserAttributes {};

export default (sequelize: Sequelize) => {
    const FafUser = sequelize.define<UserInstance>('FafUser', {
        faf_id: DataTypes.INTEGER,
        discord_id: DataTypes.STRING,
        guild_id: DataTypes.STRING,
	    discord_username: DataTypes.STRING,
    }, {});
    return FafUser;
};
