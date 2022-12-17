import { CommandInteraction, Collection } from "discord.js";
import lodash from "lodash";


// import ./gangers.js using ES6 import syntax
import { gangers } from "./commands/gangers.js";
import { fetch } from "./commands/fetch.js";
import { gangs } from "./commands/gangs.js";
import { info } from "./commands/info.js";
import { injury } from "./commands/injury.js";
import { ping } from "./commands/ping.js";
import { ammo } from "./commands/ammo.js";


const commands = new Collection();
commands.set(gangers.data.name, gangers);
commands.set(fetch.data.name, fetch);
commands.set(gangs.data.name, gangs);
commands.set(info.data.name, info);
commands.set(injury.data.name, injury);
commands.set(ping.data.name, ping);
commands.set(ammo.data.name, ammo);

export async function execute(interaction, client) {
  if (!interaction.isCommand()) return;
  const command = commands.get(interaction.commandName);
  if (!command) return;
  try {
    await command.execute(interaction, client);
  } catch (error) {
    console.error(error);
    await interaction.reply({
      content: "There was an error while executing this command!",
      ephemeral: true,
    });
  }
}

export const data = new Collection();
for (const command of commands.values()) {
  data.set(command.data.name, command.data);
}

export { commands };

