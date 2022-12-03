import { SlashCommandBuilder } from '@discordjs/builders'
import fs from 'node:fs'
import { REST } from '@discordjs/rest'
import {Routes } from 'discord-api-types/v9'
import dotenv from 'dotenv'
dotenv.config()

let guildId = "623639084669337640"
let token = process.env.TOKEN
let clientId = process.env.CLIENT_ID


const commands = [];
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

commandFiles.forEach( async (file) => {
	const command = await import(`./commands/${file}`);
	//commands.push(command.data.toJSON());
  console.log(command)
})