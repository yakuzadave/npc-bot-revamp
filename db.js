// db.js

import low from "lowdb";
import FileSync from "lowdb/adapters/FileSync";
import lodashId from "lodash-id";

const adapter = new FileSync("db.json");
const db = low(adapter);

// Mixin lodash-id for generating unique IDs
db._.mixin(lodashId);

// Set default structure if the file is empty
db.defaults({ gangs: [], gangMembers: [] }).write();

export default db;
