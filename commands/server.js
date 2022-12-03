import { SlashCommandBuilder } from '@discordjs/builders'

export const server =  {
	data: new SlashCommandBuilder()
		.setName('server')
		.setDescription('Use for testing args'),
	async execute(interaction) {
		await interaction.reply(`Server name: ${interaction.guild.name}\nTotal members: ${interaction.guild.memberCount}`);
    
	},
};