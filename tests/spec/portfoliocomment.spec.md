## Specifications 

- En temps que visiteur d’un portfolio je veux pouvoir ajouter un commentaire afin de féliciter ou emmètre des critiques constructives au portfolio d’un étudiant. 

- En temps que visiteur d’un portfolio je veux pouvoir crée mon commentaire sans pour autant me connecter, je veux pouvoir ajouter mon nom, prénom ainsi qu’une photo de profil, et lorsque je n’ai pas de photo de profil je veux voir apparaître une image de substitution 

- En temps que visiteur qui à déjà un compte, je veux pouvoir crée un commentaire tout en étant déjà connecté à mon compte foliote 

- En temps qu’utilisateur qui à un portfolio publique je veux pouvoir voir les nouveaux commentaires dans mon Dashboard et puis masquer les commentaires ne respectent pas les règles. Je veux pouvoir garder un upperssut sur les commentaires que j’ai put masquer 

- En temps qu’utilisateur je veux pouvoir ajouter un message personnalisé sur mon portfolio devant la section commentaire, afin d’inciter les visiteurs à ajouter un commentaire. 

- Crée une entité portfolio_comment et gère l’affichage des commentaire à l’aide de status 

- Cas commentaire sans compte, crée une nouvelle entité portfolio_visitor 

- L’ensemble des requêtes api devront être traiter dans frontend/api et coté backend suis la logique entités dans  /entity/portfolio/ et puis service DTO contrôler dans /portfolio/comment 

## Cas de test unitaire : 

### Cas d'erreur : prénom manquant
- Étant donné qu'un visiteur consulte un portfolio public 
- Quand il tente d'envoyer un commentaire sans renseigner son prénom 
- Alors le commentaire n'est pas enregistré Et un message d'erreur indique que le prénom est obligatoire

### Cas d'erreur : message vide
- Étant donné qu'un visiteur consulte un portfolio public
- Quand il tente d'envoyer un commentaire vide 
- Alors le commentaire n'est pas enregistré Et un message d'erreur est affiché

### Cas d'erreur : format d'image invalide
- Étant donné qu'un visiteur consulte un portfolio public
- Quand il téléverse un fichier qui n'est pas une image autorisée
- Alors le commentaire n'est pas enregistré Et un message d'erreur indique que le format du fichier est invalide

### Cas nominal : commentaire avec compte connecté
- Étant donné qu'un utilisateur est connecté à son compte
- Quand il publie un commentaire sur un portfolio 
- Alors le commentaire est enregistré Et son prénom, son nom et sa photo de profil sont récupérés depuis son compte


## Cas de test fonctionnel : 

### FT-02 : Le propriétaire masque un commentaire inapproprié
Un visiteur publie un commentaire sans photo
Préconditions
* Un portfolio public existe.
Étapes
1. Accéder au portfolio.
2. Saisir un prénom.
3. Saisir un nom.
4. Saisir un commentaire.
5. Ne pas ajouter de photo.
6. Publier le commentaire.
Résultat attendu
* Le commentaire est enregistré.
* Une image de profil par défaut est affichée.

### FT-02 : Le propriétaire masque un commentaire inapproprié
Préconditions
* Un commentaire existe sur le portfolio.
* Le propriétaire est connecté.
Étapes
1. Ouvrir le Dashboard.
2. Consulter la liste des commentaires.
3. Cliquer sur "Masquer".
Résultat attendu
* Le commentaire disparaît du portfolio public.
* Le commentaire apparaît dans la liste des commentaires masqués.

### FT-03 : Consultation des commentaires masqués
Préconditions
* Plusieurs commentaires ont été masqués.
Étapes
1. Accéder au Dashboard.
2. Ouvrir la section "Commentaires masqués".
Résultat attendu
* Tous les commentaires masqués sont visibles.
* Les informations du commentaire sont conservées.

### FT-04 : Personnalisation du message d'incitation
Préconditions
* L'utilisateur est propriétaire du portfolio.
Étapes
1. Accéder aux paramètres du portfolio.
2. Saisir un message d'encouragement.
3. Enregistrer.
4. Consulter le portfolio public.
Résultat attendu
* Le message personnalisé apparaît avant la section commentaires.

## Cas de test d’intégration : 

### IT-01 : Création d'un commentaire invité et sauvegarde en base
Composants concernés
* Formulaire
* Contrôleur
* Service Commentaire
* Base de données
Scénario
1. Un visiteur soumet un commentaire valide.
2. Le contrôleur transmet les données au service.
3. Le service crée l'entité commentaire.
4. L'entité est sauvegardée en base.
Résultat attendu
* Une ligne est créée dans la table des commentaires.
* Les données correspondent à la saisie utilisateur.