// Add in Deps for the bot

// Configs
import moment from "moment";
import chalk from "chalk";
import dotenv from "dotenv";
//import fs from "fs";
const path = import.meta.url.split('?')[1];
const fs = (await import('fs')).default;
import express from "express";
import axios from "axios";
const uuid = import("uuid");
import { Client, GatewayIntentBits, Collection, Events } from "discord.js";

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
console.log(db_data)



const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// import Environment Variables
dotenv.config();
const token = process.env.TOKEN;

client.commands = new Collection();

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
  client.on("ready", () => {
    console.log("Discord Client is now ready");
  });
});

export default client;
