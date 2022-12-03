import { SlashCommandBuilder } from '@discordjs/builders'

export const user = {
	data: new SlashCommandBuilder()
		.setName('user')
		.setDescription('Use for testing args'),
	async execute(interaction) {
		await interaction.reply(`Your tag: ${interaction.user.tag}\nYour id: ${interaction.user.id}`);

	},
};