// appel de express
const express = require("express");
// definition de express.Router
const router = express.Router();
// appel de rate limiter
// limiter le nombre de requête que peut faire un client/ des boucles de requetes pour faire planter/ forcer des mots de passe
// https://ichi.pro/fr/limitation-du-debit-de-l-api-node-js-84731174724522  ,  https://www.npmjs.com/package/express-rate-limit
// la version 6.0 plante visiblement 'raterLimit() n'est pas une fonction', la version 5.0.1  à l'air ok
const raterLimit = require("express-rate-limit");
// définition de la limitation de requete
const limiter = raterLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 50, // 50 essais
});
// on importe la logique des routes
const userCtrl = require("../controllers/user");
//----------------------------------------------------------------------------------
// ROUTES USER
//----------------------------------------------------------------------------------
// intercepte les requetes post d'inscription
router.post("/signup", userCtrl.signup);
// intercepte les requetes post d'authentification
router.post("/login", limiter, userCtrl.login);
//----------------------------------------------------------------------------------
// on exporte router
module.exports = router;
