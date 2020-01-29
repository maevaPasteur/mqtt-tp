// # Chat Log
//
// Decription du programme fourni:
//
// 1. on se connecte en mqtt à `localhost` (port 1883)
// 2. on souscrit au sujet (topic) `chat_messages`
// 3. pour chaque message est reçu, si il est du sujet `chat_messages`, l'afficher
//    sur la sortie standard

const path = require('path');
const fs = require('fs');


const MQTT = require('mqtt') // https://github.com/mqttjs/MQTT.js
const BROKER_URI = 'mqtt://localhost' // le broker auquel on se connecte
let TOPIC = 'chat/messages'  // le sujet auquel on souscrit
const LOGPATH = './logs/' // le chemin vers le dossier logs ou sont stockés les messages
const FILE_NAME = 'log_file.txt' // nom du fichier ou sont stockés les messages

// crée une connection MQTT à une uri
// retourne la promesse d'un client
let client = MQTT.connect(BROKER_URI)
console.log('connexion à %j ...', BROKER_URI)

const connexion = brokerUrl => {
  return new Promise(function (resolve, reject) {
    console.log('connecté!', brokerUrl)
    client.on('connect', resolve())
  })
}

// souscrit à un sujet pour un client
// retourne la promesse que c'est fait
const subscription = (client, topic) => {
  return new Promise( (resolve, reject) => {
    client.subscribe(TOPIC, (err, granted) => {
      if (err) {
        reject(err)
      } else {
        // le sujet a été souscrit
        console.log("%j soucrit !", topic);
        TOPIC = topic;
        // on a promis de souscrire au sujet
        resolve(granted)
      }
    })
  })
}

// on va stocker les messages en attente de traitement
const message_pool = []

const reception = client => {
  return new Promise(function (resolve, reject) {
    // quand un message est reçu
    client.on('message', (topic, payload) => {
      // on l'ajoute au pool de messages
      message_pool.push({
        topic: topic,
        payload: payload
      })
    })
    console.log("messages écoutés!")
    // on a promis d'écouter les messages en attente
    resolve()
  })
}


// recoit les messages un par un
// retourne un itérateur sur chaque message recu
// la fonction est asynchrone: il y a un "await" dedans
async function* incomings() {
  // à chaque itération
  while (true) {
    // si il y a des messages dans le pool...
    if (message_pool.length) {
      // ... on émet le premier message
      yield message_pool.shift() // on perd la main pendant que yield s'exécute
      // on récupère la main
    } else {
      // ... sinon on attend 50 millisecondes
      // en faisant appel à la boucle d'évènement
      // pour ne pas coincer le processus (while(true) {})
      // c.f. https://nodejs.org/en/docs/guides/event-loop-timers-and-nexttick/#setimmediate-vs-settimeout
      // sans cette petite pause, un des coeurs du CPU serait à 100%
      // d'activité
      await new Promise(function (resolve, reject) {
          // on résoud la promesse après 50 millisecondes
          setTimeout(() => resolve(null), 50)
      })
    }
    // on recommence
  }
}

// on va gérer le message
function handle_message(message) {
  // on l'affiche sur la sortie standard
  console.log(
      "message reçu (%s): %j",
      message.topic,
      message.payload.toString()
  )
  // une autre fonction du même genre pourrait
  // bien être asynchrone
  return Promise.resolve(message)
}

// On va vérifier qu'il existe ou créer le fichier contenant les messages du topic
const log_topic_open =  (topic) =>  {
  return new Promise((resolve, reject) => {
    // On donne un nom standard au le fichier
    let file_name = topic.replace('/', '_').replace('\\', '_').replace('-','_').replace(/[0-9]/g, '').toLocaleLowerCase().replace(/ /g, '_');
    const handler = LOGPATH + file_name + '.txt';
    if(!fs.existsSync(handler)) {
      // On créé la structure du contenu du json
      fs.writeFile(handler, '', (err) => {
        if (err) throw err;
        console.log("Le fichier " + file_name + ".txt est créé!");
      });
    }
    resolve(handler)
  })
}

// On va écrire dans le fichier
const log_topic_write =  (handler, message) => {
  return new Promise((resolve, reject) => {
    // On ajoute le contenu du message suivi d'un saut à la ligne
    fs.appendFile(handler, (message.payload.toString() + '\n'), err => {
      if (err) throw err;
      console.log('Le message a bien été enregistré!');
      resolve();
    })
  })
}

// c'est parti !
// lancement du programme
// on va gérer chaque message l'un à la suite de l'autre (en séquence)
const start = async function(client, brokerUrl, topic) {
  await connexion(brokerUrl);
  await subscription(client, topic);
  await reception(client);
  const listen = async() => {
    console.log("en attente ...");
    for await (let message of incomings()) {
      // on a recu un message
      if (message) {
        // le message correspond à un sujet souscrit
        // on attend que le message soit traité
        await handle_message(message);
        // On créé puis récupère le chemin vers le fichier contenant les messages du sujet
        let handler = await log_topic_open(topic);
        await log_topic_write(handler, message);
      }
    }
  };
  listen();
};





start(client, BROKER_URI, TOPIC);