// # Chat Log
//
// 1. se connecte en mqtt à `localhost` (port 1883)
// 2. souscrit au sujet (topic) `chat_messages`
// 3. lorsqu'un message est reçu, si il est du sujet `chat_messages`, l'afficher
//    sur la sortie standard

let mqtt = require('mqtt')
let broker_uri = 'mqtt://localhost'
let topic_string = 'chat_messages'

console.log('connexion à %j ...', broker_uri)
let client = mqtt.connect(broker_uri)

client.on('connect', function () {
  console.log('connecté !')
  console.log('souscription à %j ...', topic_string)
  client.subscribe(topic_string, function (err) {
    if (err) {
      console.error(err)
    }
  })
})

client.on('message', function (topic, message) {
  // message contient le contenu du message est un buffer
  if (topic === topic_string) {
    console.log("message reçu: %j (%s)", message.toString(), topic)
  }
})
