require('dotenv').config();
const rfs = require("rotating-file-stream");
const path = require("path");
const moment = require('moment');
require("colors");

var errLogStream = rfs.createStream('error.log', {
  interval: "7d",
  size: '100M',
  path: path.join(__dirname, 'log')
});

module.exports.warn = async (content) => {
    const timestamp = `[${moment().format('DD-MM-YYYY HH:mm:ss')}]:`
    return console.log(`${timestamp} [${"WARN".yellow}] ` + content)
};

module.exports.init = async (content) => {
    const timestamp = `[${moment().format('DD-MM-YYYY HH:mm:ss')}]:`
    return console.log(`${timestamp} [${"INIT".rainbow}] ` + content)
};

module.exports.info = async (content) => {
    const timestamp = `[${moment().format('DD-MM-YYYY HH:mm:ss')}]:`
    return console.log(`${timestamp} [${"INFO".green}] ` + content)
};

module.exports.infoscan = async (content) => {
    const timestamp = `[${moment().format('DD-MM-YYYY HH:mm:ss')}]:`
    return console.log(`${timestamp} [${"INFO".cyan}] ` + content)
};

module.exports.activity = async (content) => {
  const timestamp = `[${moment().format('DD-MM-YYYY HH:mm:ss')}]:`
  return console.log(`${timestamp} [${"ACTIV".bgYellow.blue}] ` + content)
};

module.exports.error = async (content, context) => {
    const timestamp = `[${moment().format('DD-MM-YYYY HH:mm:ss')}]:`
    const ccontext = context ? context + " : " : "Context unknown";
    var logMessage = `${timestamp} ${ccontext}${content}`;
    errLogStream.write(logMessage + '\n');
    return console.log(`${timestamp} [${"ERROR".red}] ` + ccontext + content)
};

module.exports.criticall = async (content) => {
    const timestamp = `[${moment().format('DD-MM-YYYY HH:mm:ss')}]:`
    return console.log(`${timestamp} [${"CRITICAL ERROR".bgRed}] ` + content)
};

module.exports.down = async (content) => {
    const timestamp = `[${moment().format('DD-MM-YYYY HH:mm:ss')}]:`
    return console.log(`${timestamp} [${"NET ERROR".magenta}] ` + content)
};

module.exports.cmd = async (content) => {
    const timestamp = `[${moment().format('DD-MM-YYYY HH:mm:ss')}]:`
    return console.log(`${timestamp} [${"CMDS".magenta}] ` + content)
};

module.exports.mongo = async (content) => {
  const timestamp = `[${moment().format('DD-MM-YYYY HH:mm:ss')}]:`
  return console.log(`${timestamp} [${"MONGO".bgGreen.white}] ` + content)
};

module.exports.sold = async (content) => {
  const timestamp = `[${moment().format('DD-MM-YYYY HH:mm:ss')}]:`
  return console.log(`${timestamp} [${"SOLD".bgBlue.white}] ` + content)
};

module.exports.clean = async () => {
    return console.log()
};

module.exports.clear = async () => {
    return console.clear()
};

module.exports.test = async (content) => {
    const timestamp = `[${moment().format('DD-MM-YYYY HH:mm:ss')}]:`
    console.log(`${timestamp} [${"WARN".yellow}] ` + content)
    console.log(`${timestamp} [${"INIT".rainbow}] ` + content)
    console.log(`${timestamp} [${"INFO".green}] ` + content)
    console.log(`${timestamp} [${"ERROR".red}] ` + content)
    console.log(`${timestamp} [${"CRITICAL ERROR".bgRed}] ` + content)
    console.log(`${timestamp} [${"NET ERROR".magenta}] ` + content)
    console.log(`${timestamp} [${"CMDS".cyan}] ` + content)
};