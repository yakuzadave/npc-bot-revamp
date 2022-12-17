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


export const commands = new Collection();

commands.set("ping", ping);
commands.set("fetch", fetch);
commands.set("gangs", gangs);
commands.set("gangers", gangers);
commands.set("info", info);
commands.set("injury", injury);
commands.set("ammo", ammo)
export default commands;

