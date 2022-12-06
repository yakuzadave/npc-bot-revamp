import {
  SlashCommandBuilder,
  CommandInteraction,
  Collection,
  EmbedBuilder,
} from "discord.js";
import axios from "axios";
import lodash from "lodash";
import d20 from "d20";

export const ping = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Replies with Pong!"),
  async execute(interaction) {
    await interaction.reply(`Pong!`);
  },
};

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

export const fetch = {
  data: new SlashCommandBuilder()
    .setName("fetch")
    .setDescription("Refresh the Necromunda Data"),
  async execute(interaction, client) {
    // interaction.reply("Fetching Necromunda data now.")
    await interaction.reply({ content: "Fetching data now!", ephemeral: true });
    try {
      // let req = await axios.get("https://yaktribe.games/underhive/json/gang/342438.json")
      let req = await axios.get(
        "https://necromunda-stats-vkrhmvltfqse.runkit.sh/"
      );
      // console.log(req.data)
      // console.log(client.db)

      // let ganger_data = await JSON.stringify(req.data)
      client.db.data["gangers"] = req.data;
      await client.db.write();
      await interaction.followUp({
        content: "Ganger data fetched and written to db",
        ephemeral: true,
      });

      return req.data;
    } catch (e) {
      console.error(e);
      //interaction.reply("There was an error when trying to fetch the data.  Please take a look at the bot logs for more information")
    }
  },
};

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

export const gangers = {
  data: new SlashCommandBuilder()
    .setName("ganger")
    .setDescription("Commands for your Necromunda Gangers")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("get")
        .setDescription("Get the details of one of your Necromunda Gangers")
        .addStringOption((option) =>
          option
            .setName("name")
            .setDescription("What is your Ganger name?")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("query")
            .setDescription("Optional query you can use to search")
            .setRequired(false)
        )
        .addBooleanOption((option) =>
          option
            .setName("ephemeral")
            .setDescription("Whether or not to show the results publicly")
            .setRequired(false)
        )
    ),
  async execute(interaction, client) {
    let command_options = await interaction.options;
    let subcommand = await command_options.getSubcommand();

    if (subcommand == "get") {
      console.log(command_options);
      let ganger_target = await command_options
        .getString("name")
        .toString()
        .toLowerCase();
      let query = await command_options.getString("query");
      let ephemeral = await command_options.getBoolean("ephemeral");
      console.log(ephemeral);
      let ganger_data = await client.db.data["gangers"];
      // let matched = ganger_data.filter(
      //   (ganger) => ganger["Name"].toLowerCase() == ganger_target
      // );

      // Use the filter() method with a regular expression to return all ganger objects
      // in the ganger_data array whose Name property contains the ganger_target string
      let matched = ganger_data.filter((ganger) => {
        let regex = new RegExp(`.*${ganger_target}.*`, "i");
        return regex.test(ganger["Name"]);
      });

      if (matched.length > 0) {
        let match_ganger = matched[0];
        console.log(match_ganger);
        const responseEmbed = new EmbedBuilder();
        responseEmbed.setTitle(`${match_ganger["Name"]} Stats`);
        responseEmbed.setDescription(`Stats for ${match_ganger["Name"]}`);

        // Add in Ganger Stats from the matched entry in the DB
        responseEmbed.addFields({
          name: "Status",
          value: `${match_ganger["Status"]}`,
          inline: true,
        });
        responseEmbed.addFields({
          name: "Type",
          value: `${match_ganger["Type"]}`,
          inline: true,
        });
        responseEmbed.addFields({
          name: "Type",
          value: `${match_ganger["Type"]}`,
          inline: true,
        });
        responseEmbed.addFields({
          name: "Movement",
          value: `${match_ganger["Movement"]}`,
          inline: true,
        });
        responseEmbed.addFields({
          name: "Weapon Skill",
          value: `${match_ganger["Weapon Skill"]}`,
          inline: true,
        });
        responseEmbed.addFields({
          name: "Ballistics Skill",
          value: `${match_ganger["Ballistics Skill"]}`,
          inline: true,
        });
        responseEmbed.addFields({
          name: "Strength",
          value: `${match_ganger["Strength"]}`,
          inline: true,
        });
        responseEmbed.addFields({
          name: "Toughness",
          value: `${match_ganger["Toughness"]}`,
          inline: true,
        });
        responseEmbed.addFields({
          name: "Wounds",
          value: `${match_ganger["Wounds"]}`,
          inline: true,
        });
        responseEmbed.addFields({
          name: "Initative",
          value: `${match_ganger["Initative"]}`,
          inline: true,
        });
        responseEmbed.addFields({
          name: "Attacks",
          value: `${match_ganger["Attacks"]}`,
          inline: true,
        });
        responseEmbed.addFields({
          name: "Leadership",
          value: `${match_ganger["Leadership"]}`,
          inline: true,
        });
        responseEmbed.addFields({
          name: "Cool",
          value: `${match_ganger["Cool"]}`,
          inline: true,
        });
        responseEmbed.addFields({
          name: "Will",
          value: `${match_ganger["Will"]}`,
          inline: true,
        });
        responseEmbed.addFields({
          name: "Intelligence",
          value: `${match_ganger["Intelligence"]}`,
          inline: true,
        });
        responseEmbed.addFields({
          name: "Cost",
          value: `${match_ganger["Cost"]}`,
          inline: true,
        });
        responseEmbed.addFields({
          name: "XP",
          value: `${match_ganger["XP"]}`,
          inline: true,
        });
        responseEmbed.addFields({
          name: "Kills",
          value: `${match_ganger["Kills"]}`,
          inline: true,
        });
        responseEmbed.addFields({
          name: "Advance Count",
          value: `${match_ganger["Advance Count"]}`,
          inline: true,
        });

        // Respond back with the base stats
        await interaction.reply({
          content: "Here are the stats for yoour matched ganger.",
          embeds: [responseEmbed],
          ephemeral: await ephemeral,
        });

        // Respond with Skills if the ganger has any
        if (match_ganger["Skills"].length > 0) {
          const gangerSkills = new EmbedBuilder();
          gangerSkills.setTitle(`Ganger Skills`);
          gangerSkills.setDescription(
            `A list of current ganger skills for ${match_ganger["Name"]}`
          );

          let skills_list = match_ganger["Skills"].map((skill) => {
            let obj = {};
            obj["name"] = "Skill";
            obj["value"] = skill;
            obj["inline"] = false;
            return obj;
          });

          skills_list.forEach((skill) => gangerSkills.addFields(skill));
          await interaction.followUp({
            content: "Here is a list of skills for your ganger:",
            embeds: [gangerSkills],
            ephemeral: await ephemeral,
          });
        }

        // Respond with Gear if the ganger has any
        if (match_ganger["Gear"].length > 0) {
          const gangerGear = new EmbedBuilder();
          gangerGear.setTitle(`Gear for ${match_ganger["Name"]}`);
          gangerGear.setDescription(
            `A current list of gear for ${match_ganger["Name"]}\n\n`
          );
          let gear_list = match_ganger["Gear"].map((gear) => {
            let obj = {};
            obj["name"] = `${gear["name"]}`;
            obj["value"] = `Quantity ${gear["qty"]}`;
            obj["inline"] = false;
            return obj;
          });
          gear_list.forEach((gear) => gangerGear.addFields(gear));
          await interaction.followUp({
            content: "Here is a list of gear for your ganger:",
            embeds: [gangerGear],
            ephemeral: await ephemeral,
          });
        }
      }
    }
  },
};

export const injury = {
  data: new SlashCommandBuilder()
    .setName("injury")
    .setDescription("Rolls an injury for a ganger")
    .addIntegerOption((option) =>
      option
        .setName("dice")
        .setDescription("The ganger to roll an injury for")
        .setRequired(true)
    ),
  async execute(interaction, client) {
    const dice = interaction.options.getInteger("dice");
    const rolls = d20.roll(`${dice}d6`, true);
    const roll_string = rolls.toString();
    // Create a mapping to return different strings based on the roll result
    const results = rolls.map((roll) => {
      if (roll <= 2) {
        return "Flesh Wound";
      } else if (roll <= 5) {
        return "Serious Injury";
      } else {
        return "Out of Action";
      }
    });

    // Log the results and a summary of the counts
    console.log("Roll Results:", results);

    const summary = {};
    results.forEach((result) => {
      if (result in summary) {
        summary[result]++;
      } else {
        summary[result] = 0;
      }
    });

    console.log("Summary:", summary);

    const responseEmbed = new EmbedBuilder();
    responseEmbed.setTitle(`Injury Roll`);
    responseEmbed.setDescription(`Rolling ${dice}d6 for injury`);
    responseEmbed.addFields({
      name: "Roll",
      value: `${roll_string}`,
      inline: true,
    });
    responseEmbed.addFields({
      name: "Flesh Wound",
      value: `${summary["Flesh Wound"]}`,
      inline: true,
    });
    responseEmbed.addFields({
      name: "Serious Injury",
      value: `${summary["Serious Injury"]}`,
      inline: true,
    });
    responseEmbed.addFields({
      name: "Out of Action",
      value: `${summary["Out of Action"]}`,
      inline: true,
    });
    
    await interaction.reply({
      content: "Here are the results of your injury roll.",
      embeds: [responseEmbed],
      ephemeral: await true,
    });
  },
};

export const ammo = {
  data: new SlashCommandBuilder()
    .setName("ammo")
    .setDescription("Rolls ammo for a ganger")
    .addIntegerOption((option) =>
      option
        .setName("dice")
        .setDescription("The ganger to roll ammo for")
        .setRequired(true)
    ),
  async execute(interaction, client) {
    const dice = interaction.options.getInteger("dice");
    const roll = d20.roll(`${dice}d6, true`);
    console.log(roll);
    const responseEmbed = new EmbedBuilder();
    responseEmbed.setTitle(`Ammo Roll`);
    responseEmbed.setDescription(`Rolling ${dice}d6 for ammo`);
    responseEmbed.addFields({
      name: "Roll",
      value: `${roll}`,
      inline: true,
    });
    await interaction.reply({
      content: "Here are the results of your ammo roll.",
      embeds: [responseEmbed],
      ephemeral: await true,
    });
  },
};
