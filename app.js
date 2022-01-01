// ce fichier app.js contiendra l'application
// appel de express / importation de express
const express = require("express");
// constante app qui sera notre application; ça permet de créer une application express
const app = express();
// appel de helmet, il est utilisé pour sécuriser vos en-têtes http. https://blog.risingstack.com/node-js-security-checklist/ https://expressjs.com/fr/advanced/best-practice-security.html
const helmet = require("helmet");
// appel de dotenv qui stocke des variables d'environnement et ça servira pour l'appel mongodb en dessous.
require("dotenv").config({ path: "./config/.env" });
// appel du fichier de mongodb qui permet la connection à mongodb
require("./config/mgdb");
// on importe saucesRoutes
const saucesRoutes = require("./routes/sauce.routes");
// on importe userRoutes
const userRoutes = require("./routes/user.routes");
// on importe path, donne accés au chemin du système de fichiers
const path = require("path");
// middleware d'helmet
app.use(helmet());
//----------------------------------------------------------------------------------
// CORS
//----------------------------------------------------------------------------------
// Le CORS définit comment les serveurs et les navigateurs interagissent, en spécifiant quelles ressources peuvent être demandées de manière légitime
// Pour permettre des requêtes cross-origin (et empêcher des erreurs CORS), des headers spécifiques de contrôle d'accès doivent être précisés pour tous vos objets de réponse
// middleware général ne prend pas d'adresse en premier paramètre, afin de s'appliquer à toutes les routes et sera appliqué à toutes les requetes envoyées au serveur
app.use((req, res, next) => {
  // origine, droit d'accéder c'est tout le monde '*'
  res.setHeader("Access-Control-Allow-Origin", "*");
  // headers, ce sont les headers acceptés (en-tête)
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  // methods,  ce sont les méthodes acceptés (verbe de requete)
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS, PATCH"
  );
  next();
});
//----------------------------------------------------------------------
// middleware intercepte la requete et la transforme au bon format
/* on peut écrire ceci aussi en faisant appel à body-parser      
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true})); */
app.use(express.json());
//----------------------------------------------------------------------------------
// MIDDLEWARE DEBUT DE ROUTE
//----------------------------------------------------------------------------------
// pour cette route utiliser le fichier statique
app.use("/images", express.static(path.join(__dirname, "images")));
// pour cette route la on utilise le router de userRoutes
app.use("/api/auth", userRoutes);
// pour cette route la on utilise le router de saucesRoutes
app.use("/api/sauces", saucesRoutes);
// on exporte cette constante pour pouvoir y acceder depuis d'autres fichiers
module.exports = app;
