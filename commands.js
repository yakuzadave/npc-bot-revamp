import { SlashCommandBuilder, CommandInteraction, Collection } from 'discord.js'
import axios from 'axios'
import lodash from 'lodash'


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
  async execute (interaction, client) {
    await interaction.reply(`Server name: ${interaction.guild.name}\nTotal members: ${interaction.guild.memberCount}`);
    
  }
}

export const user = {
  data: new SlashCommandBuilder()
    .setName('user')
    .setDescription('Provides you with user info from the Discord server.'),
  async execute (interaction, client) {
    	await interaction.reply(`Your tag: ${interaction.user.tag}\nYour id: ${interaction.user.id}`);
  }
}

export const fetch = {
  data: new SlashCommandBuilder()
    .setName('fetch')
    .setDescription('Refresh the Necromunda Data'),
  async execute (interaction, client) {
    // interaction.reply("Fetching Necromunda data now.")
    await interaction.reply({ content: 'Fetching data now!', ephemeral: true });
    try{
      // let req = await axios.get("https://yaktribe.games/underhive/json/gang/342438.json")
      let req = await axios.get("https://necromunda-stats-vkrhmvltfqse.runkit.sh/")
      // console.log(req.data)
      // console.log(client.db)
      
      // let ganger_data = await JSON.stringify(req.data)
      client.db.data['gangers'] = req.data
      await client.db.write()
      await interaction.followUp({ content: 'Ganger data fetched and written to db', ephemeral: true });
      
      
      return req.data
    } catch (e) {
      console.error(e)
      //interaction.reply("There was an error when trying to fetch the data.  Please take a look at the bot logs for more information")
    }
  }
}

export const ganglist = {
  data: new SlashCommandBuilder()
    .setName('ganglist')
    .setDescription('Gets the Gang Info for Necromunda and displays a summary'), 
  async execute (interaction, client) {
    await interaction.reply({content: "Getting Necromunda gang information", ephemeral: true})
    let ganger_data = client.db.data['gangers']
    try{
      let gang_name = ganger_data.map(gang => gang['Gang Name'])
      let unique_gangs = [...new Set(gang_name)];
      let gang_strings = unique_gangs.join(',')
      
      await interaction.followUp({content: `Looks like the following gangs are availible: \n ${gang_strings}`, ephemeral: true})
    } catch(e){
      console.error(e)
    }
    
  }
}

const ganger = {
  data: new SlashCommandBuilder()
    .setName('ganger')
    .setDescription("Query Necromunda Ganger info "),
  async execute (interaction, client) {
    await interaction.reply({content: "Getting the ganger info", ephemeral: true})
  }
}

