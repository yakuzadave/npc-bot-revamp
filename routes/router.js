const express = require('express')
const router = express.Router();
const { db  } = require('../index.js')

// Add in some routes




// Get players from the DB
router.get('/players', function (req, res) {
  
  let players = db.get('players').value
  
  
  res.send(players);
})

//Get a specific player

router.get('/players/:playerName')



module.exports.router = router