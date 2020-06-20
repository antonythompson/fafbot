'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    //RENAME TABLE `fafbot`.`DiscordUsers` TO `fafbot`.`GuildJoins`;
    //ALTER TABLE `GuildJoins` ADD `leave_date` DATETIME NULL AFTER `join_date`;
    //ALTER TABLE `guildjoins` DROP `name`;
    return queryInterface.createTable('GuildJoins', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      discord_id: {
        type: Sequelize.STRING,
        unique: false,
        allowNull: false,
      },
      guild_id: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      join_date: {
        allowNull: false,
        type: Sequelize.DATE
      },
      leave_date: {
        allowNull: false,
        type: Sequelize.DATE
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('GuildJoins');
  }
};