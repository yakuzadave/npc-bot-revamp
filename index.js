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
//const dialogflow = require('@google-cloud/dialogflow');
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

// create the Discord client
const Discord = require("discord.js");
const client = new Discord.Client({ intents: [Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_MESSAGES] });
require("./modules/functions.js")(client);
client.config = require("./config.js");
client.prefix = "-";
client.logger = require("./modules/Logger");
let modules = fs.readdirSync("./modules");
client.events = new Discord.Collection();

const eventFiles = fs
  .readdirSync("./events")
  .filter(file => file.endsWith(".js"));


for (const file of eventFiles) {
  const clientEvent = require(`./events/${file}`);
  
  try {
    client.on(clientEvent.name, clientEvent.event.bind(null, client));
    console.log(`Event loaded ${clientEvent.name}`);
  }
  
  catch (error) {
    console.log(`${file} failed to load`);
  }
}


client.commands = new Discord.Collection();
client.db = db;

const commandFiles = fs
  .readdirSync("./commands")
  .filter(file => file.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  
  try {
    client.commands.set(command.name, command);
  }
  
  catch (error) {
    console.log(`${command.name} failed to load`);
  }
}


//load the token from .env file
client.login(process.env.TOKEN);

//add in body-parser
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
app.use(bodyParser.json());

// Root entry
app.get("/", function(request, response) {
  
  
  
  response.send("Live");
});

app.get("/commands", function(request, response) {
  let commands = db.get("commands").value();
  response.send(commands);
});

app.post("/flow", function(request, response) {
  let commands = db.get("commands").value();
  response.send(commands);
});

app.post("/save", function(request, response) {
  db.get("events").push(request.body).write()
  response.send("Success");
});




//add listener
var listener = app.listen(process.env.PORT, function() {
  console.log(`Your app is listening on port ${listener.address().port}`);
});

// export the client and the db
module.exports.client = client;
module.exports.express = express;
module.exports.db = db;
module.exports.app = app;
