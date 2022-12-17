import { SlashCommandBuilder } from "discord.js";
import axios from "axios";

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
