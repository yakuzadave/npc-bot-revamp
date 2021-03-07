// Add in Deps for the bot

// Configs
require("dotenv").config();
const fs = require("fs");


//Express Server and Routes 
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const {router} = require('./routes/router.js')



// Utility
const axios = require("axios");
const dialogflow = require('@google-cloud/dialogflow');
const uuid = require('uuid');





//Load lowdb and set defaults  (this is a working exampe and may need to change later)
const Filesync = require("lowdb/adapters/FileSync");
const adapter = new Filesync("db.json");
const low = require("lowdb");
const db = low(adapter);
db.defaults({
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
}).write();

const Discord = require("discord.js");
const client = new Discord.Client();



