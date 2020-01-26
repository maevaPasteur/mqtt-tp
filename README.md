# MQTT Lab

| Application   | Service          | Accès                           |
|:-------------:|:----------------:|:--------------------------------|
| Chat          | NGINX (HTTP)     | <http://localhost:8080/chat>    |
| MQTT Utility  | NGINX (HTTP)     | <http://localhost:8080/utility> |
| Node-RED      | node (HTTP)      | <http://localhost:1080/>        |
|               | MQTT             | IP: localhost, ports: 1883      |
|               | MQTT (WebSocket) | IP: localhost, ports: 9001      |

## Mise en route des services

### Configuration [Docker](https://docker.com/)

> Configuration privilégiée

| Action                  | Commande                 |
|------------------------:|:-------------------------|
| Démarrer les services   | `docker-compose up -d`   |
| Arrêter les services    | `docker-compose down`    |
| Supprimer les services  | `docker-compose down -v` |
| Consulter les logs      | `docker-compose logs -f` |

### Configuration [Vagrant](https://vagrantup.com/)

> Configuration de repli (installe docker sur un Linux)

| Action                  | Commande                                |
|------------------------:|:----------------------------------------|
| Démarrer les services   | `vagrant up`                            |
| Arrêter les services    | `vagrant halt`                          |
| Supprimer les services  | `vagrant destroy`                       |
| Consulter les logs      | `vagrant ssh -c "docker-compose -f /vagrant/docker-compose.yml logs -f"` |

## Utilisation

Le répertoire `./app` est pris en charge par le service HTTP NGINX: Tout fichier dans ce répertoire est accessible
par l'URL <http://localhost:8080/...>

> Consulter le répertoire `examples` pour plus d'applications
