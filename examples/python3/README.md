# Exemples Python ([Python 3])

> Utilise la bibliothèque python [paho-mqtt](https://pypi.org/project/paho-mqtt/)

## Installation

_Prérequis_: disposer d'une version récente de [Python 3]

Se placer dans le répertoire `python3` (`cd [le chemin de python3]`)

créer un environnement virtuel, l'activer et rapatrier les dépendances logicielles:

```bash
python3 -m venv venv
source ./venv/bin/activate
pip install --upgrade pip
pin install -r requirements.txt
```

> Pour sortir de l'environnement virtuel: `deactivate`

## Chat Log

### Comportement de l'application

1. se connecte en mqtt à `localhost` (port 1883)
2. souscrit au sujet (topic) `chat_messages`
3. lorsqu'un message est reçu, si il est du sujet `chat_messages`, l'afficher
  sur la sortie standard

### Utilisation

```bash
python chat-log.py
```

> `Ctrl-C` pour interrompre

[Python 3]: https://www.python.org/
