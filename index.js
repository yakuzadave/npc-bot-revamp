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

// const ready = import("./events/ready.js");
const { Logger } = import("./modules/Logger.js");
const __dirname = dirname(fileURLToPath(import.meta.url));
const file = join(__dirname, "db.json");
const adapter = new JSONFile(file);
const db = new Low(adapter);
const timers = import("node:timers/promises");
const wait = timers.setTimeout;

import db_data from "./db_old.json";
//console.log(db_data)

// load commands
import { ping, server, user, fetch } from "./commands.js";
let command_list = [ping, server, user, fetch];
console.log("Loaded command files: ", command_list);
let invoke_register = false;

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// import Environment Variables
dotenv.config();
const token = process.env.TOKEN;
const client_id = process.env.CLIENT_ID;

const command_data_list = command_list.map((command) => command.data.toJSON());

const rest = new REST({ version: "10" }).setToken(token);

const registerCommand = async (command_data_list, rest, Routes) => {
  try {
    await rest;
    command_data_list = await command_data_list.map(async (command) => {
      let res = await command;
      console.log("Command: ", await res);
      return res;
    });
    await console.log("Started refreshing application (/) commands.");
    let req = command_data_list.map(
      async (command) =>
        await rest.put(Routes.applicationCommands(client), {
          body: await command,
        })
    );
    Promise.allSettled(req)
      .then((res) => res.map((r) => r.value))
      .then((res) => console.log(res))
      .then((res) => console.log("All commands registered"));
  } catch (e) {
    console.log("An error has been encountered: ", e);
  }
};

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
  if (db.data == null) {
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
    console.log(db);
    client.db = db;
    return client;
  } else {
    await db.read();
    console.log(db);
    client.db = db;
    return client;
  }
};


const discord_init = async (client) => {
  let login_req = await client.login(token);
  login_req.then((res) => console.log(res));

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
      await command.execute(interaction);
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


console.log(command_data_list);
if (invoke_register == true) {
  registerCommand(command_data_list, rest, Routes);
}

if (client.commands.lengeth == 0){
  client = discord_addCommands(client, command_list)
}

client = init_db(client, db)

client = discord_init(client)





export default client;
