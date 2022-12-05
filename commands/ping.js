import { SlashCommandBuilder, CommandInteraction, Collection } from 'discord.js'


export const command = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong!'),
	async execute (interaction) {
		await interaction.reply('Pong!');
	},
};

export const server = {
  data: new SlashCommandBuilder()
    .setName('server')
    .setDescription('Return server information.')
  async execute (interaction.reply)
}