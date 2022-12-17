import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import d20 from "d20";

/* Here is the explanation for the code below:
1. Create a mapping to return different strings based on the roll result
2. Log the results and a summary of the counts
3. Create an embed to display the results of the roll */

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
    const rolls = d20.roll(`${dice}d6`, true);
    const roll_string = rolls.toString();
    // Create a mapping to return different strings based on the roll result
    const results = rolls.map((roll) => {
      if (roll == 1) {
        return "Hit and Out of Ammo";
      } else if (roll <= 2 && roll < 4) {
        return " One Hit";
      } else if (roll <= 5 && roll < 6) {
        return "Two Hits";
      } else {
        return "Three Hits";
      }
    });

    // Log the results and a summary of the counts
    console.log("Roll Results:", results);

    const summary = {
      "Hit and Out of Ammo": 0,
      "One Hit": 0,
      "Two Hits": 0,
      "Three Hits": 0,
    };
    results.forEach((result) => {
      if (result in summary) {
        summary[result]++;
      }
    });

    console.log("Summary:", summary);
    const responseEmbed = new EmbedBuilder();
    responseEmbed.setTitle(`Ammo Roll`);
    responseEmbed.setDescription(`Rolling ${dice}d6 for ammo`);
    responseEmbed.addFields({
      name: "Roll",
      value: `${roll_string}`,
      inline: true,
    });
    responseEmbed.addFields({
      name: "Hit and Out of Ammo",
      value: `${summary["Hit and Out of Ammo"]}`,
      inline: true,
    });
    responseEmbed.addFields({
      name: "One Hit",
      value: `${summary["One Hit"]}`,
      inline: true,
    });
    responseEmbed.addFields({
      name: "Two Hits",
      value: `${summary["Two Hits"]}`,
      inline: true,
    });
    responseEmbed.addFields({
      name: "Three Hits",
      value: `${summary["Three Hits"]}`,
      inline: true,
    });

    await interaction.reply({
      content: "Here are the results of your ammo roll.",
      embeds: [responseEmbed],
      ephemeral: false,
    });
  },
};
