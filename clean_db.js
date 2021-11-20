const Filesync = require("lowdb/adapters/FileSync");
const adapter = new Filesync("db.json");
const low = require("lowdb");
const db = low(adapter);


let members = db.get('members').value()


let unique_members = [...new Set(members)];


db.set('members', unique_members).write()





