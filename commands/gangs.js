import { SlashCommandBuilder, EmbedBuilder } from "discord.js";

export const gangs = {
  data: new SlashCommandBuilder()
    .setName("gangs")
    .setDescription("Gets the Gang Info for Necromunda")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("list")
        .setDescription("Get the list of availible Necromunda Gangs")
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("info")
        .setDescription("Get information about your Necromunda Gang")
        .addStringOption((option) =>
          option
            .setName("name")
            .setDescription("The name of the gang you are querying for")
            .setRequired(true)
        )
    ),
  async execute(interaction, client) {
    let command_options = await interaction.options;
    let subcommand = command_options.getSubcommand();
    if (subcommand == "list") {
      await interaction.reply({
        content: "Getting Necromunda gang information",
        ephemeral: true,
      });
      let ganger_data = client.db.data["gangers"];
      try {
        let gang_name = ganger_data.map((gang) => gang["Gang Name"]);
        let unique_gangs = [...new Set(gang_name)];
        client.db.data["gangs"] = unique_gangs;
        let gang_strings = unique_gangs.join(",");

        // await interaction.followUp({
        //   content: `Looks like the following gangs are availible: \n ${gang_strings}`,
        //   ephemeral: true,
        // });
        let formatted = unique_gangs.map((gang) => {
          let obj = {};
          obj["name"] = "Gang Name";
          obj["value"] = gang;
          obj["inline"] = false;
          return obj;
        });
        const responseEmbed = new EmbedBuilder();
        responseEmbed.setTitle("Gang List");
        responseEmbed.setDescription(
          "A List of Gangs that are availible for Necromunda"
        );
        formatted.forEach((field) => responseEmbed.addFields(field));
        interaction.followUp({
          embeds: [responseEmbed],
          content: "Here is your list of gangs",
          ephemeral: true,
        });

        client.db.write();
      } catch (e) {
        console.error(e);
      }
    }
    if (subcommand == "info") {
      console.log(command_options);
      let gang_target = await command_options.getString("name");
      // await interaction.reply({
      //   content: `Getting results for ${gang_target}`,
      //   emphemeral: true
      // });
      let ganger_data = await client.db.data["gangers"];
      let gang_list = client.db.data["gangs"];

      if (gang_list.includes(gang_target)) {
        let matched = ganger_data.filter(
          (ganger) => ganger["Gang Name"] == gang_target
        );

        let formatted = matched.map((ganger) => {
          let obj = {};
          obj["name"] = ganger["Name"];
          obj[
            "value"
          ] = `**Type:** ${ganger["Type"]}\n**Status:** ${ganger["Status"]}\n`;
          obj["inline"] = false;
          return obj;
        });

        console.log(formatted);
        const responseEmbed = new EmbedBuilder();
        responseEmbed.setTitle("Ganger List");
        responseEmbed.setDescription(
          "A List of Gangers for your Necromunda Ganger"
        );
        formatted.forEach((field) => responseEmbed.addFields(field));

        await interaction.reply({
          embeds: [responseEmbed],
          content: "Looks like we have a match",
          ephemeral: true,
        });
      }
    }
  },
};
