import { SlashCommandBuilder } from '@discordjs/builders'
import fs from 'fs'
import { REST } from '@discordjs/rest'
import {Routes } from 'discord-api-types/v9'
require('dotenv').config()


let guildId = "623639084669337640"
let token = process.env.TOKEN
let clientId = process.env.CLIENT_ID


const commands = [];
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	commands.push(command.data.toJSON());
}