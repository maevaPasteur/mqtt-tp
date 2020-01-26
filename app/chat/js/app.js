let mqtt;
const reconnectTimeout = 2000;
const host = "localhost"; //change this
//const host="iot.eclipse.org"
//const port=80
const port = 9001;
let user;

function makeid() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 5; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}

function onFailure(message) {
  console.log("Connection Attempt to Host "+host+"Failed");
  setTimeout(MQTTconnect, reconnectTimeout)
}

function onMessageArrived(msg) {
  let li = document.createElement('li')
  li.appendChild(document.createTextNode(msg.payloadString))
  document.getElementById('messages').appendChild(li)
  window.scrollTo(0, document.body.scrollHeight)
  out_msg="Message received "+msg.payloadString+"<br>"
  out_msg=out_msg+"Message received Topic "+msg.destinationName
  console.log(msg)
  console.log(out_msg)
}

function onConnect() {
  // Once a connection has been made, make a subscription and send a message.
  console.log("Connected ")
  mqtt.subscribe("chat_messages");
  const mel = document.getElementById('m')
  document.getElementById('user').appendChild(document.createTextNode(user))
  document.getElementById('message_form').addEventListener('submit', function (e) {
    sendMessage(mel.value)
    mel.value = ''
    e.preventDefault()
    return false
  })
}

function sendMessage(message) {
  message = new Paho.MQTT.Message(user + ": " + message);
  message.destinationName = "chat_messages";
  mqtt.send(message);
}

function App() {
  user = "user-" + makeid()
  console.log("connecting to "+ host +" "+ port);
  mqtt = new Paho.MQTT.Client(host, port, user);
  var options = {
    timeout: 3,
    onSuccess: onConnect,
    onFailure: onFailure,
  };
  mqtt.onMessageArrived = onMessageArrived
  mqtt.connect(options); //connect
}
