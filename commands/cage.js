import { SlashCommandBuilder } from '@discordjs/builders'

export const cage = (message, args, client) => {
	let data = new SlashCommandBuilder()
  .setName('cage')
  .setDescription('Nicolas Cage-isms')
  .addAction(message => {
    
  })
  .addInteraction(async (message) => { 
    await message.reply(`Server name: ${message.guild.name}\nTotal members: ${message.guild.memberCount}`);
  })
};

