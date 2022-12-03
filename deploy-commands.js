import { SlashCommandBuilder } from '@discordjs/builders'
import fs from 'node:fs'
import { REST, Routes } from 'discord.js'
// import {Routes } from 'discord-api-types/v9'
import dotenv from 'dotenv'
dotenv.config()

let guildId = "623639084669337640"
let token = process.env.TOKEN
let clientId = process.env.CLIENT_ID


//const commands = [];
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

let commands = Promise.all(commandFiles.map( async (file) => {
	const command = await import(`./commands/${file}`);
	//commands.push(command.data.toJSON());
  let command_string = await JSON.stringify(command)
  console.log("command_string: ", command_string)
  let command_json = await JSON.parse(command_string)
  console.log("command_json: ", command_json)
  
  command_json = await command_json[`${file}`].data.toJSON()
  return command_json
}))

const rest = new REST({ version: '10'})
console.log(rest)
//rest.setToken(token)

let deploy_tokens = async (res, rest, Routes, token) => {
  let commands = await res.map(command => command.value)
  try {
    rest.setToken(token)
    console.log(`Starting refresh of ${commands.length} commands`)
    const data = await rest.put(
      Routes.applicationGuildCommands(clientId, guildId),
      {body: commands},
    );
    console.log(`Successfully reloaded ${data.length} commands`)
  } catch (error) {
    console.error(error);
  }
}

Promise.allSettled(commands)
.then(re)