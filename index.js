// Add in Deps for the bot

// Configs
import dotenv from "dotenv"
import fs from 'fs'
import express from "express"
import axios from 'axios'
const uuid = import('uuid')

import path from 'path'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { Low } from 'lowdb'
import { JSONFile } from 'lowdb/node'
const logger = import("./modules/Logger.js")


//import {router} from './routes/router.js'
dotenv.config();



//Express Server and Routes 
// const express = require("express");
const app = express();
// const {router} = require('./routes/router.js')



// Utility
// const axios = require("axios");
//const dialogflow = require('@google-cloud/dialogflow');
// const uuid = require('uuid');
// const path = require('path')





//Load lowdb and set defaults  (this is a working exampe and may need to change later)
// const Filesync = require("lowdb/adapters/FileSync");
// const adapter = new Filesync("db.json");
// const low = require("lowdb");

const __dirname = dirname(fileURLToPath(import.meta.url));
const file = join(__dirname, 'db.json')
const adapter = new JSONFile(file)
const db = new Low(adapter)
// const db = low(adapter);
db.data || {
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
  count: 0
}

import { Client, GatewayIntentBits, Collection } from 'discord.js'
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// create the Discord client
// const Discord = require("discord.js");
// const { Client, Collection, Intents } = require('discord.js');
// const client = new Client({ intents: [Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_MESSAGES] });

//require("./modules/functions.js")(client);
//client.config = require("./config.js");
// client.prefix = "-";
client.logger = logger
//let modules = fs.readdirSync("./modules");
client.events = new Collection();
client.db = db
client.commands = new Collection()

const eventFiles = fs
  .readdirSync("./events")
  .filter(file => file.endsWith(".js"));


for (const file of eventFiles) {
  const clientEvent = import(`./events/${file}`);
  
  try {
    client.on(clientEvent.name, clientEvent.event.bind(null, client));
    console.log(`Event loaded ${clientEvent.name}`);
  }
  
  catch (error) {
    console.log(`${file} failed to load`);
  }
}





const commandFiles = fs
  .readdirSync("./commands")
  .filter(file => file.endsWith(".js"));

for (const file of commandFiles) {
  const command = import(`./commands/${file}`);
  
  try {
    client.commands.set(command.data.name, command);
    //client.commands.set(command.name, command);
  }
  
  catch (error) {
    console.log(`${command.name} failed to load`);
  }
}


//load the token from .env file
client.login(process.env.TOKEN);

// // Root entry
// app.get("/", function(req, res) {
  
  
  
//   res.sendFile(path.join(__dirname + '/views/coc_notes.html'));
// });

// app.get("/commands", function(request, response) {
//   let commands = db.get("commands").value();
//   response.send(commands);
// });

// app.post("/flow", function(request, response) {
//   let commands = db.get("commands").value();
//   response.send(commands);
// });

// app.post("/save", function(request, response) {
//   db.get("events").push(request.body).write()
//   response.send("Success");
// });




// //add listener
// var listener = app.listen(process.env.PORT, function() {
//   console.log(`Your app is listening on port ${listener.address().port}`);
// });

// export the client and the db

export default client