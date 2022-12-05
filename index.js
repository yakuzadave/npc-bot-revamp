// Add in Deps for the bot

// Configs
import moment from "moment";
import chalk from "chalk";
import dotenv from "dotenv";
//import fs from "fs";
import { URL } from 'url';
import { readFile } from 'fs/promises';
const path = import.meta.url.split('?')[1];
const fs = async () => (import('fs')).default;
import express from "express";
import axios from "axios";
const uuid = import("uuid");
import { Client, GatewayIntentBits, Collection, Events,  REST, Routes } from "discord.js";

import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";

const ready = import("./events/ready.js");
const { Logger } = import("./modules/Logger.js");
const __dirname = dirname(fileURLToPath(import.meta.url));
const file = join(__dirname, "db.json");
const adapter = new JSONFile(file);
const db = new Low(adapter);


import db_data from './db_old.json'
//console.log(db_data)

// load commands
import {ping, server, user} from './commands.js'
let command_list = [ping, server, user]
console.log("Loaded command files: ", command_list)





const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// import Environment Variables
dotenv.config();
const token = process.env.TOKEN;
const client_id = process.env.CLIENT_ID


const command_data_list = command_list.map(command => command.data.toJSON())

const rest = new REST({ version: '10' }).setToken(token);

const registerCommand = async(command, rest, Routes) => {
  try{
    await rest
    console.log('Started refreshing application (/) commands.');
    let req = await rest.put(Routes.applicationCommands(client), { body: command });
    console.log(req)
    
  } catch(e){
    console.log("An error has been encountered: ", e)
    
  }
  
}

command_data_list.forEach(command => command.then(res))
registerCommand(command_data_list, rest, Routes)


client.commands = new Collection();
const discord_command_list = command_list.map(async (command) => {
  let set_command = await client.commands.set(command.name, command )
  return set_command
})


let login = Promise.resolve(client.login(token)).then(async (res) => {
  console.log("Logged into Discord");
  await db.read();
  client.events = new Collection();
  if (db.data == null) {
    // db defaults
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
    await db.write()
  }
  console.log(db);
  client.db = db;
  
  // Fire ready event
  client.on("ready", () => {
    console.log("Discord Client is now ready");
  });
  
  // Interaction Events
  client.on(Events.InteractionCreate, interaction => {
    console.log(interaction)
    if (!interaction.isChatInputCommand()) return; 
  })
  
  client.on("message", message => {
    console.log(message)
  })
  
  
});

export default client;
