# Foliode

[notion](https://www.notion.so/36cb117ffd6e80289beaf6598f8e90e6?v=36cb117ffd6e80cf9684000cbfc35017&source=copy_link)

Le projet **Foliode**  permet de générer et personnaliser un portfolio web professionnel, mettant en valeur les compétences et les projets personnel et pro. 
## Diagramme Use Case

![Use Case Diagram](./img/Foliode_UC.png)

## Technologies et Stack

- **Frontend** : Next, React (TypeScript), Tailwind, Docker.
- **Backend** : Symfony, PostgreSQL, Docker.
- **Dispositifs Interactifs** : Blender, Three.js pour la modélisation et l’affichage 3D.
- **Design** : Suite Adobe, Figma pour la création visuelle et les maquettes.



### Charte graphique

![Charte graphique partie 1](./img/Foliode_CharteGraphique1.png)
![Charte graphique partie 2](./img/Foliode_CharteGraphique2.png)
![Charte graphique partie 3](./img/Foliode_CharteGraphique3.png)

---

#  Démarrage du projet

Ce projet utilise Docker et `invoke` (`inv`) pour simplifier les commandes de développement.

Avant de commencer, assurez vous d’avoir installé :

- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)
- Python + Invoke (`pip install invoke`)

Vérifiez que tout fonctionne :

```bash
docker --version
docker compose version
inv --version
```


```bash
inv setup
```

Cette commande va automatiquement : Créer les fichiers .env, Builder les images Docker, Démarrer les conteneurs, Installer les dépendances backend/frontend, Générer les clés JWT, Exécuter les migrations Doctrine

- si inv ne fonctionne pas 
```bash 
source .venv/bin/activate 
```
- Build des images Docker

```bash
inv build
```
- Démarrer les services

```bash 
inv up
```

- Arrêter les services 

```bash 
inv down
```

- Voir les conteneurs actifs 

```bash 
inv ps
```

# 🐳 Conteneurs Docker

Le projet utilise les conteneurs Docker suivants :

## Backend API

Container : `foliode_backend`

Service Symfony principal de l’application.

### Responsabilités

- API backend Symfony
- Gestion de l’authentification JWT
- Exécution des migrations Doctrine
- Gestion des mails et du Messenger

### Port exposé

```txt
API backend Symfony :  8000 -> 80
Base de données PostgreSQL : 5432 -> 5432
```
