# Chat Log
#
# 1. se connecte en mqtt à `localhost` (port 1883)
# 2. souscrit au sujet (topic) `chat_messages`
# 3. lorsqu'un message est reçu, si il est du sujet `chat_messages`, l'afficher
#    sur la sortie standard

import paho.mqtt.client as mqtt
broker_host = 'localhost'
topic_string = 'chat_messages'


def on_connect(client, userdata, flags, rc):
    print('connecté !')
    print('souscription à %s ...' % repr(topic_string))
    client.subscribe(topic_string)


def on_message(client, userdata, msg):
    if msg.topic == topic_string:
        payload = str(msg.payload, encoding='utf8')
        print('message reçu: %s (%s)' % (repr(payload), msg.topic))


if __name__ == '__main__':
    client = mqtt.Client()
    client.on_connect = on_connect
    client.on_message = on_message
    client.connect(broker_host, 1883, 60)
    client.loop_forever()
