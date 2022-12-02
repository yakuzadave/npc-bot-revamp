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
import {ready} from './events/ready.js'
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


client.logger = logger
//let modules = fs.readdirSync("./modules");
client.events = new Collection();
client.db = db
client.commands = new Collection()

console.log(ready)
client.on('ready', ready['event'])


//load the token from .env file
client.login(process.env.TOKEN);
console.log("Logged into Discord")

export default client