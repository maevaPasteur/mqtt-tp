// # Chat Log
//
// Decription du programme fourni:
//
// 1. on se connecte en mqtt à `localhost` (port 1883)
// 2. on souscrit au sujet (topic) `chat_messages`
// 3. pour chaque message est reçu, si il est du sujet `chat_messages`, l'afficher
//    sur la sortie standard

const MQTT = require('mqtt') // https://github.com/mqttjs/MQTT.js
const BROKER_URI = 'mqtt://localhost' // le broker auquel on se connecte
const TOPIC = 'chat/messages'  // le sujet auquel on souscrit

// crée une connection MQTT à une uri
// retourne la promesse d'un client
let client = MQTT.connect(BROKER_URI)
console.log('connexion à %j ...', BROKER_URI)
const connexion = new Promise(function (resolve, reject) {
    console.log('connecté!', BROKER_URI)
    client.on('connect', resolve())
})

// souscrit à un sujet pour un client
// retourne la promesse que c'est fait
const subscription = new Promise(function (resolve, reject) {
    client.subscribe(TOPIC, function (err, granted) {
        if (err) {
            reject(err)
        } else {
            // le sujet a été souscrit
            console.log("%j soucrit !", TOPIC)
            // on a promis de souscrire au sujet
            resolve(granted)
        }
    })
})

// on va stocker les messages en attente de traitement
const message_pool = []

const reception = new Promise(function (resolve, reject) {
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

// c'est parti !
// lancement du programme
// on va gérer chaque message l'un à la suite de l'autre (en séquence)
connexion             // on se connecte
    .then(subscription) // on souscrit au topic
    .then(reception)    // on attend les messages
    .then(async () => { // on traite
        //  ^^^^^ il y a un await dans la fonction
        console.log("en attente ...")
        for await (let message of incomings()) {
            // ^^^^ for await: "incomings" est asynchrone!
            // on a recu un message
            if (message) {
                // le message correspond à un sujet souscrit
                // on attend que le message soit traité
                await handle_message(message)
            }
        }
    })
