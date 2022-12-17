import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import d20 from "d20";

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
        .addBooleanOption((option) =>
          option
            .setName("ephemeral")
            .setDescription("Whether or not to show the results publicly")
            .setRequired(false)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("hit")
        .setDescription("Make an attack with your Ganger")
        .addStringOption((option) =>
          option
            .setName("name")
            .setDescription("What is your Ganger name?")
            .setRequired(true)
        )
        .addIntegerOption((option) =>
          option
            .setName("dice")
            .setDescription("The ganger to roll an injury for")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("skill")
            .setDescription("What skill are you using? BS or WS")
            .setRequired(true)
            .addChoices(
              { name: "Ballistics Skill", value: "Ballistics Skill" },
              { name: "Weapon Skill", value: "Weapon Skill" }
            )
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

    /* Here's what's happening here:
    1. I'm using the `getBoolean` method to get the value of the `--ephemeral` option. If it doesn't exist, it will return false.
    2. I'm using the `getString` method to get the value of the `name` option. If it doesn't exist, it will return null.
    3. I'm using the `toString` method to convert the value to a string.
    4. I'm using the `toLowerCase` method to convert the value to lowercase. */
    if (subcommand == "hit" || subcommand == "get") {
      let ganger_target = await command_options
        .getString("name")
        .toString()
        .toLowerCase();
      let ephemeral = false;

      if (command_options.getBoolean("ephemeral")) {
        ephemeral = await command_options.getBoolean("ephemeral");
      }

      let ganger_data = await client.db.data["gangers"];
      let matched = await ganger_data.filter((ganger) => {
        let regex = new RegExp(`.*${ganger_target}.*`, "i");
        return regex.test(ganger["Name"]);
      });
      if (subcommand == "hit") {
        if (matched.length > 0) {
          let match_ganger = matched[0];
          console.log(match_ganger);
          let skill = await command_options.getString("skill");
          let skill_value = parseInt(match_ganger[skill]);

          console.log("Skill Value:", skill_value);

          let dice = await command_options.getInteger("dice");
          const rolls = d20.roll(`${dice}d6`, true);
          console.log("Rolls:", rolls);
          let roll_string = rolls.toString();
          const results = rolls.map((roll) => {
            if (parseInt(roll) >= skill_value) {
              return "Hit";
            } else {
              return "Miss";
            }
          });

          // Log the results and a summary of the counts
          console.log("Roll Results:", results);

          const summary = {
            Hit: 0,
            Miss: 0,
          };
          results.forEach((result) => {
            if (result in summary) {
              summary[result]++;
            }
          });

          console.log("Summary:", summary);
          const responseEmbed = new EmbedBuilder();
          responseEmbed.setTitle(`Hit Roll`);
          responseEmbed.setDescription(
            `Rolling ${dice}d6 for to see if you hit`
          );
          responseEmbed.addFields({
            name: "Roll",
            value: `${roll_string}`,
            inline: true,
          });
          responseEmbed.addFields({
            name: "Hit",
            value: `${summary["Hit"]}`,
            inline: true,
          });
          responseEmbed.addFields({
            name: "Miss",
            value: `${summary["Miss"]}`,
            inline: true,
          });

          await interaction.reply({
            content: "Here are your results",
            embeds: [responseEmbed],
            ephemeral: ephemeral,
          });
        }
      }

      if (subcommand == "get") {
        console.log(command_options);

        //let query = await command_options.getString("query");
        console.log(ephemeral);

        // let matched = ganger_data.filter(
        //   (ganger) => ganger["Name"].toLowerCase() == ganger_target
        // );
        // Use the filter() method with a regular expression to return all ganger objects
        // in the ganger_data array whose Name property contains the ganger_target string
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
    }
  },
};

// Add in ES6 export for gangers command
export default gangers;
