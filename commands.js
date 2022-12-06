import { SlashCommandBuilder, CommandInteraction, Collection } from 'discord.js'
import axios from 'axios'


export const ping = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong!'),
	async execute (interaction) {
    await interaction.reply(`Pong!`);
		
	},
};

export const server = {
  data: new SlashCommandBuilder()
    .setName('server')
    .setDescription('Return server information.'),
  async execute (interaction) {
    await interaction.reply(`Server name: ${interaction.guild.name}\nTotal members: ${interaction.guild.memberCount}`);
    
  }
}

export const user = {
  data: new SlashCommandBuilder()
    .setName('user')
    .setDescription('Provides you with user info from the Discord server.'),
  async execute (interaction) {
    	await interaction.reply(`Your tag: ${interaction.user.tag}\nYour id: ${interaction.user.id}`);
  }
}

export const fetch = {
  data: new SlashCommandBuilder()
    .setName('fetch')
    .setDescription('Refresh the Necromunda Data'),
  async execute (interaction, client) {
    interaction.reply("Fetching Necromunda data now.")
    try{
      // let req = await axios.get("https://yaktribe.games/underhive/json/gang/342438.json")
      let req = await axios.get("https://necromunda-stats-vkrhmvltfqse.runkit.sh/")
      console.log(req.data)
      let ganger_data = JSON.stringify
      client.db.gangers.set()
      
      return req.data
    } catch (e) {
      console.error(e)
      //interaction.reply("There was an error when trying to fetch the data.  Please take a look at the bot logs for more information")
    }
  }
}