module.exports = {
  name: "interactionCreate",
  description: "client interaction events",
  event: async (client,interaction) => {
    if (!interaction.isCommand()) return;
    const { commandName } = interaction;
    if (commandName === 'ping') {
      await interaction.reply('Pong!');
    } else if (commandName === 'beep') {
      await interaction.reply('Boop!');
    }
  }
};
