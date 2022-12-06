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

export const info = {
  data: new SlashCommandBuilder()
  .setName('info')
	.setDescription('Get info about a user or a server!')
  .addSubcommand(subcommand => subcommand
                 .setName('user')
                 .setDescription('Info about a user')
                 .addUserOption(option => option.setName('target').setDescription('The user')))
	.addSubcommand(subcommand =>
                 subcommand
                 .setName('server')
                 .setDescription('Info about the server')),
  async execute(interaction, client ) {
    //await interaction.reply({content: "Getting info", ephemeral: true})
    let command_options = await interaction.options
    let subcommand = command_options.getSubcommand()
    
    
    console.log("Options: ", command_options )
    console.log("subcommand: ", subcommand)
    
    if(subcommand == 'user'){
      const target = interaction.options.getUser('target');
      if (target) {
				await interaction.reply({content: `Username: ${target.username}\nID: ${target.id}`, ephemeral: true});
			} else {
				await interaction.reply({content: `Your username: ${interaction.user.username}\nYour ID: ${interaction.user.id}`, ephemeral: true});
      }
    }
    if(subcommand =='server') {
      await interaction.reply({content: `Server name: ${interaction.guild.name}\nTotal members: ${interaction.guild.memberCount}`, ephemeral: true});
    }
    
    
    
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

export const gangs = {
  data: new SlashCommandBuilder()
    .setName('gangs')
    .setDescription('Gets the Gang Info for Necromunda')
    .addSubcommand(subcommand => subcommand
                   .setName("ganglist")
                   .setDescription("Get ")
                  ), 
  async execute (interaction, client) {
    await interaction.reply({content: "Getting Necromunda gang information", ephemeral: true})
    let ganger_data = client.db.data['gangers']
    try{
      let gang_name = ganger_data.map(gang => gang['Gang Name'])
      let unique_gangs = [...new Set(gang_name)];
      client.db.data['gangs'] = unique_gangs
      let gang_strings = unique_gangs.join(',')
      
      await interaction.followUp({content: `Looks like the following gangs are availible: \n ${gang_strings}`, ephemeral: true})
      client.db.write()
    } catch(e){
      console.error(e)
    }
    
  }
}

export const ganger = {
  data: new SlashCommandBuilder()
    .setName('ganger')
    .setDescription("Query Necromunda Ganger info "),
    
  async execute (interaction, client) {
    await interaction.reply({content: "Getting the ganger info", ephemeral: true})
  }
}

