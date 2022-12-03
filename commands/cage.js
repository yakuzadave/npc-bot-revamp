import { SlashCommandBuilder } from '@discordjs/builders'

export const cage = (message, args, client) => {
	let data = new SlashCommandBuilder()
  .setName('cage')
  .setDescription('Nicolas Cage-isms')
  .addAction(message => {
    
  })
  .addInteraction(async (message) => { 
    await interaction.reply(`Server name: ${interaction.guild.name}\nTotal members: ${interaction.guild.memberCount}`);
  })
};
