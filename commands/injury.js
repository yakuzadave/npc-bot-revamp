import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import d20 from "d20";

export const injury = {
  data: new SlashCommandBuilder()
    .setName("injury")
    .setDescription("Rolls an injury for a ganger")
    .addIntegerOption((option) =>
      option
        .setName("dice")
        .setDescription("The ganger to roll an injury for")
        .setRequired(true)
    )
    .addBooleanOption((option) =>
      option
        .setName("ephemeral")
        .setDescription("Should the response be ephemeral?")
        .setRequired(false)
    ),
  async execute(interaction, client) {
    const dice = interaction.options.getInteger("dice");
    let ephemeral = false;
    try {
      ephemeral = interaction.options.getBoolean("ephemeral");
    } catch (error) {
      ephemeral = false;
    }
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
    // console.log("Roll Results:", results);
    const summary = {
      "Flesh Wound": 0,
      "Serious Injury": 0,
      "Out of Action": 0,
    };
    results.forEach((result) => {
      if (result in summary) {
        summary[result]++;
      }
    });

    // console.log("Summary:", summary);
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
