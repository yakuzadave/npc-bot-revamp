// Add in Deps for the bot

// Configs
import dotenv from "dotenv"
import fs from 'fs'
import express from "express"
import axios from 'axios'
const uuid = import('uuid')
import { Client, GatewayIntentBits, Collection, Events } from 'discord.js'
import path from 'path'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { Low } from 'lowdb'
import { JSONFile } from 'lowdb/node'


const ready =  import('./events/ready.js')
const {Logger} = import("./modules/Logger.js")
const __dirname = dirname(fileURLToPath(import.meta.url));
const file = join(__dirname, 'db.json')
const adapter = new JSONFile(file)
const db = new Low(adapter)

const client = new Client({ intents: [GatewayIntentBits.Guilds] });


// import Environment Variables
dotenv.config();
const 






// db defaults
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

client.events = new Collection();
client.db = db
client.commands = new Collection()









// //load the token from .env file
// 
// console.log("Logged into Discord")

// export default client