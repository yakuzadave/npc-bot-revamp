import { SlashCommandBuilder } from "discord.js";

export const info = {
  data: new SlashCommandBuilder()
    .setName("info")
    .setDescription("Get info about a user or a server!")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("user")
        .setDescription("Info about a user")
        .addUserOption((option) =>
          option.setName("target").setDescription("The user")
        )
    )
    .addSubcommand((subcommand) =>
      subcommand.setName("server").setDescription("Info about the server")
    ),
  async execute(interaction, client) {
    let command_options = await interaction.options;
    let subcommand = command_options.getSubcommand();

    console.log("Options: ", command_options);
    console.log("subcommand: ", subcommand);

    if (subcommand == "user") {
      const target = interaction.options.getUser("target");
      if (target) {
        await interaction.reply({
          content: `Username: ${target.username}\nID: ${target.id}`,
          ephemeral: true,
        });
      } else {
        await interaction.reply({
          content: `Your username: ${interaction.user.username}\nYour ID: ${interaction.user.id}`,
          ephemeral: true,
        });
      }
    }
    if (subcommand == "server") {
      await interaction.reply({
        content: `Server name: ${interaction.guild.name}\nTotal members: ${interaction.guild.memberCount}`,
        ephemeral: true,
      });
    }
  },
};
