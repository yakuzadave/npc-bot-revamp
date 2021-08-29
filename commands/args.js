const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('args')
		.setDescription('Use for testing args'),
	async execute(interaction) {
		await interaction.reply('Pong!');
	},
};