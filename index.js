// const express = require('express');
// const crypto = require('crypto');
// const app = express();
// const { createServer } = require('node:http');
// const { Server } = require('socket.io');
// const server = createServer(app);
// const io = new Server(app);
// const port = process.env.PORT || 5000;

// const db = require("./serverCode/database.js");
// const wg = require("./serverCode/wanderersGuide.js")

// const io = require('socket.io')(port);
// console.log(`Port: ${port}.`)

// const characters = db.getCharactersIDs();
// const mailsDictionary = db.getMailsDictionary();
// const wgTokens = db.getTokens();
//const wgApiKey = FROM .env
//const frontEndUrl = FROM .env

//****** */

// const addingCodes = [];


// app.get('/', (req, res) => {
//   console.log('consolling test');
//   res.send("Hello, this is Let's Roll One backend. Nothing to do here. :) XDXD")
// });

// app.get('/new-char-code', (req, res) => {
//   const newCode = crypto.randomBytes(16).toString('hex');
//   addingCodes.push(newCode);
//   res.send(newCode);
// })

// app.get('/new-character', async (req, res) => wg.addNewCharacter(req, res, db, addingCodes, wgTokens));

// app.listen(port, () => {
//   console.log(`Example app listening at http://localhost:${port}`);
// });

// server.listen(3000, () => {
//   console.log('Server Socketowy');
// });

// io.on('connection', (socket) => {
//   console.log("hello in the socket")

//   socket.on('disconnect', () => {})
//   socket.on('chat-message', message => {})
// })


const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: ["https://okruszek-ultima.netlify.app"]
  }
});
// const io = new Server(server);
const PORT = process.env.PORT || 3000;

const cloudinary = require('cloudinary').v2;
          
cloudinary.config({ 
  cloud_name: 'kajos', 
  api_key: '121945744997438', 
  api_secret: 'Yti6vrbiUlDfStOEZHvl1bl-_os' 
});

app.use(bodyParser.json({limit: '50mb'}));
app.use(cors({origin: true, credentials:true}));

const socket = require('./serverCode/sockets.js');
const characters = require('./serverCode/characterManagement.js');

app.get('/', (req, res) => {
    res.write(`<h1>HEJ! Socket IO Start on Port : ${PORT}</h1>`);
    res.end();
});

app.get('/character/:characterID', (req, res) => {
  if (!characters.characterMiddleware()) {res.status(401); return;}
  const id = req.params.characterID;
  res.send(JSON.stringify(characters.getCharacter(id)));
})

app.get('/charactersIDMap', (req, res) => {
  if (!characters.characterMiddleware()) {res.status(401); return;}
  res.send(JSON.stringify(characters.getCharactersIDMap()));
})

socket.handleSockets(io);

app.post('/visuals', (req, res) => {
  //TODO: check if content is from GM
  const body = req.body;
  const uploaded = [];
  if (body.category === '') return;
  body.data.forEach(visual => {
    cloudinary.uploader.upload(visual.content,
  { public_id:  visual.name}, 
  function(error, result) {
    const newObject = {name: result.public_id, url: result.url}
    uploaded.push(newObject);
  });
  })
  //result.url
})



server.listen(PORT, () => {
    console.log('listening on ', PORT);
});

function getCharacterData(){
  const newBeginning = {"about":{"DCs":[{"name":"AC","value":22},{"name":"class DC","value":14},{"name":"speed","value":30},{"name":"perception","value":12},{"name":"arcane spellcasting DC","value":23},{"name":"occult spellcasting DC","value":25}],"abilities":[{"name":"Strength","value":10},{"name":"Dexterity","value":14},{"name":"Constitution","value":16},{"name":"Intelligence","value":19},{"name":"Wisdom","value":16},{"name":"Charisma","value":10}],"generalInfo":[{"name":"class","value":"Psychic"},{"name":"heritage","value":"Half-Elf Human"},{"name":"background","value":"Astrologer"},{"name":"size","value":"Medium"}],"traits":["Elf","Half-Elf","Human","Humanoid"]},"rolls":[{"name":"Fortitude","value":12,"family":"saving throws and perception"},{"name":"Reflex","value":13,"family":"saving throws and perception"},{"name":"Will","value":14,"family":"saving throws and perception"},{"name":"perception","value":12,"family":"saving throws and perception"},{"name":"Dagger","value":"+11","family":"attacks"},{"name":"Falchion","value":"+1","family":"attacks"},{"name":"Fist","value":"+11","family":"attacks"},{"name":"Improvised Weapon","value":"+7","family":"attacks"},{"name":"Mentalist's Staff","value":"+9","family":"attacks"},{"name":"arcane spell attack","value":13,"family":"attacks"},{"name":"occult spell attack","value":15,"family":"attacks"},{"name":"Dagger","value":"1d4 P","family":"damage"},{"name":"Falchion","value":"1d10 S","family":"damage"},{"name":"Fist","value":"1d4 B","family":"damage"},{"name":"Improvised Weapon","value":"1d6 B","family":"damage"},{"name":"Mentalist's Staff","value":"1d4 B","family":"damage"},{"name":"Acrobatics","value":2,"family":"skills"},{"name":"Arcana","value":16,"family":"skills"},{"name":"Athletics","value":0,"family":"skills"},{"name":"Crafting","value":13,"family":"skills"},{"name":"Deception","value":0,"family":"skills"},{"name":"Diplomacy","value":9,"family":"skills"},{"name":"Intimidation","value":0,"family":"skills"},{"name":"Medicine","value":12,"family":"skills"},{"name":"Nature","value":12,"family":"skills"},{"name":"Occultism","value":18,"family":"skills"},{"name":"Performance","value":0,"family":"skills"},{"name":"Religion","value":12,"family":"skills"},{"name":"Society","value":13,"family":"skills"},{"name":"Stealth","value":11,"family":"skills"},{"name":"Survival","value":3,"family":"skills"},{"name":"Thievery","value":2,"family":"skills"},{"name":"Astrology Lore","value":13,"family":"skills"},{"name":"Loremaster Lore","value":13,"family":"skills"},{"name":"Mercantile Lore","value":13,"family":"skills"}]}
  return newBeginning;
}

function getCharacterData2(){
  const newBeginning = {"about":{"DCs":[{"name":"AC","value":28},{"name":"class DC","value":10},{"name":"speed","value":30},{"name":"perception","value":12},{"name":"arcane spellcasting DC","value":23},{"name":"occult spellcasting DC","value":25}],"abilities":[{"name":"Strength","value":10},{"name":"Dexterity","value":14},{"name":"Constitution","value":16},{"name":"Intelligence","value":19},{"name":"Wisdom","value":16},{"name":"Charisma","value":10}],"generalInfo":[{"name":"class","value":"Psychic"},{"name":"heritage","value":"Half-Elf Human"},{"name":"background","value":"Astrologer"},{"name":"size","value":"Medium"}],"traits":["Twoj","Stary","Human","Humanoid"]},"rolls":[{"name":"Fortitude","value":12,"family":"saving throws and perception"},{"name":"Reflex","value":13,"family":"saving throws and perception"},{"name":"Will","value":14,"family":"saving throws and perception"},{"name":"perception","value":12,"family":"saving throws and perception"},{"name":"Dagger","value":"+11","family":"attacks"},{"name":"Falchion","value":"+1","family":"attacks"},{"name":"Fist","value":"+11","family":"attacks"},{"name":"Improvised Weapon","value":"+7","family":"attacks"},{"name":"Mentalist's Staff","value":"+9","family":"attacks"},{"name":"arcane spell attack","value":13,"family":"attacks"},{"name":"occult spell attack","value":15,"family":"attacks"},{"name":"Dagger","value":"1d4 P","family":"damage"},{"name":"Falchion","value":"1d10 S","family":"damage"},{"name":"Fist","value":"1d4 B","family":"damage"},{"name":"Improvised Weapon","value":"1d6 B","family":"damage"},{"name":"Mentalist's Staff","value":"1d4 B","family":"damage"},{"name":"Acrobatics","value":2,"family":"skills"},{"name":"Arcana","value":16,"family":"skills"},{"name":"Athletics","value":0,"family":"skills"},{"name":"Crafting","value":13,"family":"skills"},{"name":"Deception","value":0,"family":"skills"},{"name":"Diplomacy","value":9,"family":"skills"},{"name":"Intimidation","value":0,"family":"skills"},{"name":"Medicine","value":12,"family":"skills"},{"name":"Nature","value":12,"family":"skills"},{"name":"Occultism","value":18,"family":"skills"},{"name":"Performance","value":0,"family":"skills"},{"name":"Religion","value":12,"family":"skills"},{"name":"Society","value":13,"family":"skills"},{"name":"Stealth","value":11,"family":"skills"},{"name":"Survival","value":3,"family":"skills"},{"name":"Thievery","value":2,"family":"skills"},{"name":"Astrology Lore","value":13,"family":"skills"},{"name":"Loremaster Lore","value":13,"family":"skills"},{"name":"Mercantile Lore","value":13,"family":"skills"}]}
  return newBeginning;
}

function getCharacterData3(){
  return [getCharacterData(), getCharacterData2()]
}



