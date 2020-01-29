# Devoir sur mqtt

Par Maëva Pasteur  
M1 DEV / ECV Digital

---

## Manquements au programme

1. ###### Certaines erreurs ne sont pas gérées quelles sont elles ?
On ne gère pas les erreurs de toutes les promesses, on utilise seulement resolve.
Cas résent pour les fonctions :
* `handle_message()`
* `log_topic_open()`
* `log_topic_write()`
* `connexion()`
* `subscription()`
* `reception()`

2. ###### Comment vous y prendriez vous pour les gérer (une ou deux courtes phrases)
Pour gérer le cas des erreurs dans les promesses, il faudrait utiliser le reject et afficher l'erreur dans la console.

## Question bonus
###### Modifier le programme pour qu'il puisse utiliser plusieurs topic (et donc plusieurs fichiers de log)
Fait en partie.
Ma fonction `log_topic_open()` prend pour parametre le TOPIC, s'il change alors elle créé un nouveau fichier s'il n'existe pas déjà. Son handler est ensuite passé en parametre à la fonction `log_topic_write()` qui écrira à son tour dans le bon fichier. 