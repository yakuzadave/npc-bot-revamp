/*
Logger class for easy and aesthetically pleasing console logging 
*/
// const chalk = require("chalk");

import chalk from 'chalk'
// const moment = require("moment");
import moment from 'moment'

const logger = {}
logger.log = (content, type = "log") => {
  const timestamp = `[${moment().format("YYYY-MM-DD HH:mm:ss")}]:`;
  switch (type) {
    case "log": {
      return console.log(
        `${timestamp} ${chalk.bgBlue(type.toUpperCase())} ${content} `
      );
    }
    case "warn": {
      return console.log(
        `${timestamp} ${chalk.black.bgYellow(type.toUpperCase())} ${content} `
      );
    }
    case "error": {
      return console.log(
        `${timestamp} ${chalk.bgRed(type.toUpperCase())} ${content} `
      );
    }
    case "debug": {
      return console.log(
        `${timestamp} ${chalk.green(type.toUpperCase())} ${content} `
      );
    }
    case "cmd": {
      return console.log(
        `${timestamp} ${chalk.black.bgWhite(type.toUpperCase())} ${content}`
      );
    }
    case "ready": {
      return console.log(
        `${timestamp} ${chalk.black.bgGreen(type.toUpperCase())} ${content}`
      );
    }
    default:
      throw new TypeError(
        "Logger type must be either warn, debug, log, ready, cmd or error."
      );
  }
};



 logger.error = (...args) => {
  return this.log(...args, "error");
};

logger.warn = (...args) => this.log(...args, "warn");

logger.debug = (...args) => this.log(...args, "debug");

logger.cmd = (...args) => this.log(...args, "cmd");

export let Logger = logger
