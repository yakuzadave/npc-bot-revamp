// Add in Deps for the bot

// Configs
import moment from "moment";
import chalk from "chalk";
import dotenv from "dotenv";
//import fs from "fs";
import { URL } from "url";
import { readFile } from "fs/promises";
const path = import.meta.url.split("?")[1];
const fs = async () => import("fs").default;
import express from "express";
import axios from "axios";
const uuid = import("uuid");
import {
  Client,
  GatewayIntentBits,
  Collection,
  Events,
  REST,
  Routes,
} from "discord.js";

import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import lodash from 'lodash'

// const ready = import("./events/ready.js");
const { Logger } = import("./modules/Logger.js");
const __dirname = dirname(fileURLToPath(import.meta.url));
const file = join(__dirname, "db.json");
const adapter = new JSONFile(file);
const db = new Low(adapter);
import {setTimeout} from "node:timers/promises"
const wait = setTimeout;
console.log("wait: ", wait)

import db_data from "./db_old.json";
//console.log(db_data)

// load commands
import { ping, server, user, fetch } from "./commands.js";
let command_list = [ping, server, user, fetch];
console.log("Loaded command files");
let invoke_register = false;
// let invoke_register = true;






// import Environment Variables
dotenv.config();
const token = process.env.TOKEN;


// init Discord Client
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const rest = new REST({ version: "10" }).setToken(token);


// Register Slash Commands Function
const registerCommand = async (command_data_list, rest, Routes) => {
  
  try {
    await rest;
    await console.log("Started refreshing application (/) commands.");
    const client_id = await process.env.CLIENT_ID;
    const command_data = await command_data_list.map((command) => command.data.toJSON())
    wait(2000)
    console.log(await command_data)
    let req = await rest.put(Routes.applicationCommands(client_id), {body: command_data})
    // let req = command_data_list.map(
    //   async (command) =>
    //     await rest.put(Routes.applicationCommands(client_id), {
    //       body: await command_data,
    //     })
    // );
    
    console.log(await req)
    console.log("Discord Command registration complete")
    
  
    
    
  } catch (e) {
    console.log("An error has been encountered: ", e);
  }
};

// Load Discord Commands Function
const discord_addCommands = async (client, command_list) => {
  console.log(`Adding ${command_list.length} commands to Discord Client.`);
  client.commands = new Collection();
  let discord_command_list = command_list.forEach(
    async (command) => await client.commands.set(command.data.name, command)
  );
  
  await wait(3000)
  return client;
};

const init_db = async (client, db) => {
  if (typeof db.data == 'undefined' ) {
    db.data = {
      commands: [],
      events: [],
      skills: {},
      players: [],
      mobs: [],
      objects: {},
      weapons: {},
      armor: {},
      ships: {},
      resources: {},
      time: 0,
      locations: {},
      count: 0,
    };
    await db.write();
    await db.read();
    client.db = db;
    console.log("LowDB added as Discord DB")
    return client;
  } else {
    await db.read();
    console.log(db);
    client.db = db;
    console.log("LowDB added as Discord DB")
    return client;
  }
};


const discord_init = async (client) => {
  let login_req = await client.login(token);
  //console.log(await login_req)

  client.events = new Collection();

  // Fire ready event
  client.on("ready", () => {
    console.log("Discord Client is now ready");
  });
  // Interaction Events
  client.on(Events.InteractionCreate, async (interaction) => {
    console.log(interaction);
    if (!interaction.isChatInputCommand()) return;
    const command = interaction.client.commands.get(interaction.commandName);
    if (!command) {
      console.error(
        `No command matching ${interaction.commandName} was found.`
      );
      return;
    }
    try {
      let command_res = await command.execute(interaction, client);
    } catch (error) {
      console.error(error);
      await interaction.reply({
        content: "There was an error while executing this command!",
        ephemeral: true,
      });
    }
  });

  client.on("message", (message) => {
    console.log(message);
  });
  
  return client
};


if (invoke_register == true) {
  registerCommand(command_list, rest, Routes);
}

if (typeof client.commands == 'undefined'){
  
  discord_addCommands(client, command_list)
}

init_db(client, db)

wait(1000)
discord_init(client)





export default client;
