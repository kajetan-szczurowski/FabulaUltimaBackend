//const wgClientId = FROM .env
//const wgSecretKey = FROM .env
const wgURL = 'https://wanderersguide.app/api';

exports.getCharactersIDMap = function(){
  const data = {
    'Jan': '420',
    'Pawel': '69'
  };
  return data;
}

exports.characterMiddleware = function(){
    //Check credentials
  //Check user's autherizations
  return true;
}

exports.getCharacter =  function(id){ // was (id, tokens)
    return charactersPlaceholder(id);
    // const characterData = await downloadCharacter(id, tokens);
    if (!characterData) return {};
    return compileStats(characterData);

}

function charactersPlaceholder(id){
  const one = {"name": "Jan", "id": "420", "windows": ["about, rolls"], "about":{"DCs":[{"name":"AC","value":22},{"name":"class DC","value":14},{"name":"speed","value":30},{"name":"perception","value":12},{"name":"arcane spellcasting DC","value":23},{"name":"occult spellcasting DC","value":25}],"abilities":[{"name":"Strength","value":10},{"name":"Dexterity","value":14},{"name":"Constitution","value":16},{"name":"Intelligence","value":19},{"name":"Wisdom","value":16},{"name":"Charisma","value":10}],"generalInfo":[{"name":"class","value":"Psychic"},{"name":"heritage","value":"Half-Elf Human"},{"name":"background","value":"Astrologer"},{"name":"size","value":"Medium"}],"traits":["Elf","Half-Elf","Human","Humanoid"]},"rolls":[{"name":"Fortitude","value":12,"family":"saving throws and perception"},{"name":"Reflex","value":13,"family":"saving throws and perception"},{"name":"Will","value":14,"family":"saving throws and perception"},{"name":"perception","value":12,"family":"saving throws and perception"},{"name":"Dagger","value":"+11","family":"attacks"},{"name":"Falchion","value":"+1","family":"attacks"},{"name":"Fist","value":"+11","family":"attacks"},{"name":"Improvised Weapon","value":"+7","family":"attacks"},{"name":"Mentalist's Staff","value":"+9","family":"attacks"},{"name":"arcane spell attack","value":13,"family":"attacks"},{"name":"occult spell attack","value":15,"family":"attacks"},{"name":"Dagger","value":"1d4 P","family":"damage"},{"name":"Falchion","value":"1d10 S","family":"damage"},{"name":"Fist","value":"1d4 B","family":"damage"},{"name":"Improvised Weapon","value":"1d6 B","family":"damage"},{"name":"Mentalist's Staff","value":"1d4 B","family":"damage"},{"name":"Acrobatics","value":2,"family":"skills"},{"name":"Arcana","value":16,"family":"skills"},{"name":"Athletics","value":0,"family":"skills"},{"name":"Crafting","value":13,"family":"skills"},{"name":"Deception","value":0,"family":"skills"},{"name":"Diplomacy","value":9,"family":"skills"},{"name":"Intimidation","value":0,"family":"skills"},{"name":"Medicine","value":12,"family":"skills"},{"name":"Nature","value":12,"family":"skills"},{"name":"Occultism","value":18,"family":"skills"},{"name":"Performance","value":0,"family":"skills"},{"name":"Religion","value":12,"family":"skills"},{"name":"Society","value":13,"family":"skills"},{"name":"Stealth","value":11,"family":"skills"},{"name":"Survival","value":3,"family":"skills"},{"name":"Thievery","value":2,"family":"skills"},{"name":"Astrology Lore","value":13,"family":"skills"},{"name":"Loremaster Lore","value":13,"family":"skills"},{"name":"Mercantile Lore","value":13,"family":"skills"}]}
  const two = {"name": "Pawel", "id": "69", "windows": ["about, rolls"],"about":{"DCs":[{"name":"AC","value":28},{"name":"class DC","value":10},{"name":"speed","value":30},{"name":"perception","value":12},{"name":"arcane spellcasting DC","value":23},{"name":"occult spellcasting DC","value":25}],"abilities":[{"name":"Strength","value":10},{"name":"Dexterity","value":14},{"name":"Constitution","value":16},{"name":"Intelligence","value":19},{"name":"Wisdom","value":16},{"name":"Charisma","value":10}],"generalInfo":[{"name":"class","value":"Psychic"},{"name":"heritage","value":"Half-Elf Human"},{"name":"background","value":"Astrologer"},{"name":"size","value":"Medium"}],"traits":["Twoj","Stary","Human","Humanoid"]},"rolls":[{"name":"Fortitude","value":12,"family":"saving throws and perception"},{"name":"Reflex","value":13,"family":"saving throws and perception"},{"name":"Will","value":14,"family":"saving throws and perception"},{"name":"perception","value":12,"family":"saving throws and perception"},{"name":"Dagger","value":"+11","family":"attacks"},{"name":"Falchion","value":"+1","family":"attacks"},{"name":"Fist","value":"+11","family":"attacks"},{"name":"Improvised Weapon","value":"+7","family":"attacks"},{"name":"Mentalist's Staff","value":"+9","family":"attacks"},{"name":"arcane spell attack","value":13,"family":"attacks"},{"name":"occult spell attack","value":15,"family":"attacks"},{"name":"Dagger","value":"1d4 P","family":"damage"},{"name":"Falchion","value":"1d10 S","family":"damage"},{"name":"Fist","value":"1d4 B","family":"damage"},{"name":"Improvised Weapon","value":"1d6 B","family":"damage"},{"name":"Mentalist's Staff","value":"1d4 B","family":"damage"},{"name":"Acrobatics","value":2,"family":"skills"},{"name":"Arcana","value":16,"family":"skills"},{"name":"Athletics","value":0,"family":"skills"},{"name":"Crafting","value":13,"family":"skills"},{"name":"Deception","value":0,"family":"skills"},{"name":"Diplomacy","value":9,"family":"skills"},{"name":"Intimidation","value":0,"family":"skills"},{"name":"Medicine","value":12,"family":"skills"},{"name":"Nature","value":12,"family":"skills"},{"name":"Occultism","value":18,"family":"skills"},{"name":"Performance","value":0,"family":"skills"},{"name":"Religion","value":12,"family":"skills"},{"name":"Society","value":13,"family":"skills"},{"name":"Stealth","value":11,"family":"skills"},{"name":"Survival","value":3,"family":"skills"},{"name":"Thievery","value":2,"family":"skills"},{"name":"Astrology Lore","value":13,"family":"skills"},{"name":"Loremaster Lore","value":13,"family":"skills"},{"name":"Mercantile Lore","value":13,"family":"skills"}]}
  if (id == 420) return one;
  if (id == 69) return two;
}

async function downloadCharacter(id, tokens){
    if (!typeof id === 'string') return;
    let downloaded;
    try {
        await fetch(`${wgURL}/char/${id}/calculated-stats`, {
          headers: { Authorization: tokens[id] },
        }).then((resp) => resp.json())
          .then((json) => (downloaded = JSON.stringify(json)));
        return downloaded;
        
      } catch (error) {
        return null;
      }
}

exports.addNewCharacter = async function(req, res, database, addingCodes, tokens){
    const url = req.originalUrl;
    const indexQuestionMark = url.indexOf('?');
    if (indexQuestionMark < 0 || !url.includes('&')) {
      res.sendStatus(400);
      return;
    }

    const params = url.substring(indexQuestionMark + 1);
    const [rawCode, rowState] = params.split('&');
    const code = rawCode.substring(rawCode.indexOf('=') + 1);
    const state = rowState.substring(rowState.indexOf('=') + 1);

    if (!addingCodes.includes(code)){
        res.sendStatus(401);
        return;
    }

    if (!code || !state) {
        res.sendStatus(400);
        return;
    }

    addingCodes.splice(addingCodes.indexOf(code), 1);

    let result;
    const requestOptions = {
      method: 'POST',
      headers: { Authorization: wgSecretKey },
    };
    await fetch(
      `${wgURL}/oauth2/token?code=${code}&client_id=${wgClientID}`,
      requestOptions
    )
      .then((response) => (accessToken = response.json()))
      .then((json) => (result = JSON.stringify(json)));

    const characterData = {
      characterID: result.char_id,
      expireDate: result.expires_in,
      token: result.access_token,
    };

    tokens[result.char_id] = characterData;

    await database.addNewCharacter(tokens);
    res.redirect([200], frontEndUrl);
      
}

function compileStats(statistics) {
    const keyDictionary = getKeyDictionary();
    const { traits, ...generals } = JSON.parse(statistics.generalInfo);
    const generalInfo = compileObject(generals);
    const passiveStatistics = [
      prepareFeObject(statistics, 'totalAC'),
      prepareFeObject(statistics, 'totalClassDC'),
      prepareFeObject(statistics, 'totalSpeed'),
      prepareFeObject(statistics, 'totalPerception'),
    ];
    const DCs = [...passiveStatistics, ...compileDCs(statistics)];
    const abilities = JSON.parse(statistics.totalAbilityScores);
  
    const aboutSection = {
      DCs: DCs,
      abilities: abilities,
      generalInfo: generalInfo,
      traits: traits,
    };
  
    const savings = compileSkills(
      'saving throws and perception',
      JSON.parse(statistics.totalSaves)
    );
  
    return {aboutSection: aboutSection, savings:savings};
  
    function compileSkills(family, inp) {
      console.log(inp);
    }
  
    function compileObject(obj) {
      const result = [];
      Object.keys(obj).forEach((key) => {
        result.push(prepareFeObject(obj, key));
      });
      return result;
    }
  
    function prepareFeObject(objectReference, key) {
      return { Name: keyDictionary.get(key), value: objectReference[key] };
    }
  
    function compileDCs(stats) {
      const traditions = ['arcane', 'occult', 'primal', 'divine'];
      const compiled = [];
      traditions.forEach((trad) => {
        if (stats[`${trad}SpellProfMod`])
          compiled.push(prepareFeObject(stats, `${trad}SpellDC`));
      });
      return compiled;
    }
  
    function getKeyDictionary() {
      return new Map([
        ['totalAC', 'AC'],
        ['totalClassDC', 'class DC'],
        ['totalSpeed', 'speed'],
        ['totalPerception', 'perception'],
  
        ['arcaneSpellDC', 'arcane spellcasting DC'],
        ['primalSpellDC', 'primal spellcasting DC'],
        ['divineSpellDC', 'divine spellcasting DC'],
        ['occultSpellDC', 'occult spellcasting DC'],
  
        ['className', 'class'],
        ['heritageAncestryName', 'heritage'],
        ['backgroundName', 'background'],
        ['size', 'size'],
      ]);
    }
  }