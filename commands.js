import { SlashCommandBuilder, CommandInteraction, Collection } from 'discord.js'


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