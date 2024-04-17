const axios = require('axios');

//Mongo DB Actions Endpoints

const READ_ACTION = "find";
const WRITE_ACTION = "insertOne";
const UPDATE_ACTION = "updateOne";
const DELETE_ACTION = "deleteOne";
const actions = [READ_ACTION, WRITE_ACTION, UPDATE_ACTION, DELETE_ACTION];

//DataBase constants

//const database = FROM .env
//const dataSource = FROM .env
const dbURL = "https://data.mongodb-api.com/app/data-sqxht/endpoint/data/v1/action/";
//const dbApiKey = FROM .env
// const headers = {
//     'Content-Type': 'application/json',
//     'Access-Control-Request-Headers': '*',
//     'api-key': dbApiKey
//   };

// Let's roll one constants

//const IDsSource = {collection: , _id: }
//const mailsSource = {collection: , _id: }

exports.getCharactersIDs = async function (){
    const charactersIDs = await databaseRequest(READ_ACTION, IDsSource);
    return charactersIDs;
}

exports.getMailsDictionary = async function (){
    const charactersIDs = await databaseRequest(READ_ACTION, mailsSource);
    return charactersIDs;
}

exports.addNewCharacter = async function(characterData){
    characterData._id = IDsSource._id;
    characterData.collection = IDsSource.collection;
    await databaseRequest(UPDATE_ACTION);
    return true;
}

function databaseRequest(order, requestData){
    if (!actions.includes(order)) return;
    if (!requestData.collection) return;
    const data = {
        "collection": requestData.collection,
        "database": database,
        "dataSource": dataSource
}

    let requestURL;
    switch(order){
        case READ_ACTION:
            requestURL = dbURL.concat(READ_ACTION);
            if (requestData.hasOwnProperty("name")) data["filter"] = {"name": requestData.name};
            if (requestData.hasOwnProperty("_id"))  data["filter"] = {"_id": { "$oid": requestData._id} };
            break;

        case DELETE_ACTION:
            requestURL = dbURL.concat(DELETE_ACTION);
            data["filter"] = {"_id": { "$oid": requestData._id} };
            break;

        case WRITE_ACTION:
            requestURL = dbURL.concat(WRITE_ACTION);
            data["document"] = requestData.data;
            break;

        case UPDATE_ACTION:
            requestURL = dbURL.concat(UPDATE_ACTION);
            data["filter"] = {"_id": { "$oid": requestData._id} };
            data["update"] = requestData.update;
            break;
    }

    const config = {
        method: 'post',
        url: requestURL, 
        headers: headers,
        data: data
    };
    
    return axios(config);
}