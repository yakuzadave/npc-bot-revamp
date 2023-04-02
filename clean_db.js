const Filesync = require("lowdb/adapters/FileSync");
const adapter = new Filesync("db.json");
const low = require("lowdb");
const db = low(adapter);


let players = db.get('players')


let unique_players = [...new Set(players.map(player => player['name']).value())];

console.log(`There are ${unique_players.length} unique members in the DB`)

let res = []

let unique_player_obj = unique_players.map(unique_player => db.get('players').filter(player => player['name']== unique_player).value()[0])

console.log(unique_player_obj)


db.remove('players').write()
db.set('players', unique_player_obj).write()

db.write()


