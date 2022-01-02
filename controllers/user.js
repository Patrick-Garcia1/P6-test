// appel de bcrypt
const bcrypt = require("bcrypt");
// appel de jsonwebtoken
const jwt = require("jsonwebtoken");
// appel de model user
const User = require("../models/User_model");
// appel du modele de mot de passe
var passwordSchema = require("../models/Password_model");
// appel de la fonction isEmail de validator que l'on installe npm install validator pour gérer la validation de l'email (comme une regex)
// https://www.npmjs.com/package/validator
const validator = require("validator");
//----------------------------------------------------------------------------------
// LOGIQUE SIGNUP
//----------------------------------------------------------------------------------
// enregistrement de nouveaux utilisateurs grace a signup
// pour améliorer la sécurité on pourrait demander une confirmation d'inscription via boite mail et rajouter une logique
exports.signup = (req, res, next) => {
  // vérification dans la requete de l'email via validator
  const valideEmail = validator.isEmail(req.body.email);
  // vérification du shéma mot de passe
  const validePassword = passwordSchema.validate(req.body.password);
  // si l'email et le mot de passe sont bon
  if (valideEmail === true && validePassword === true) {
    // fonction pour hasher/crypter le mot de passe en 10 tours pour le sel
    bcrypt
      .hash(req.body.password, 10)
      // quand c'est hashé
      .then((hash) => {
        // créer un modele User avec email et mot de pase hashé
        const user = new User({
          email: req.body.email,
          password: hash,
        });
        // sauvegarde le user dans la base de donnée
        user
          .save()
          //status 201 Created et message en json
          .then(() =>
            res
              .status(201)
              .json({ message: "User created (FR)Utilisateur créé !" })
          )
          // si erreur au hashage status 400 Bad Request et message en json
          .catch((error) => res.status(400).json({ error }));
      })
      // au cas d'une erreur status 500 Internal Server Error et message en json
      .catch((error) => res.status(500).json({ error }));
    // si le mot de passe ou l'email ou les 2 ne sont pas bon
  } else {
    console.log("Email ou mot de passe non conforme au standart ");
    // information au cas le mot de passe serait invalide
    console.log(
      "(not = caratère invalide) manquant au mot de passe: " +
        passwordSchema.validate(req.body.password, { list: true })
    );
  }
};
//----------------------------------------------------------------------------------
// LOGIQUE LOGIN
//----------------------------------------------------------------------------------
// l'identification d'utilisateur grace a login
// on pourrait demander un autre type de vérification pour le login et y rajouter sa logique (captcha ou code reçu par téléphone avec un input à compléter)
exports.login = (req, res, next) => {
  // on trouve l'adresse qui est rentrée par un utilisateur (requete)
  User.findOne({ email: req.body.email })
    // pour un utilisateur
    .then((user) => {
      // si la requete email ne correspond pas à un utisateur
      if (!user) {
        // status 401 Unauthorized et message en json
        return res.status(401).json({ error });
      }
      // si c'est ok bcrypt compare le mot de passe de user avec celui rentré par l'utilisateur dans sa request
      bcrypt
        .compare(req.body.password, user.password)
        // à la validation
        .then((valid) => {
          // si ce n'est pas valide
          if (!valid) {
            // retourne un status 401 Unauthorized et un message en json
            return res.status(401).json({ error });
          }
          // si c'est ok status 201 Created et renvoi un objet json
          res.status(201).json({
            // renvoi l'user id
            userId: user._id,
            // renvoi un token traité/encodé
            token: jwt.sign(
              // le token aura le user id identique à la requete d'authentification
              { userId: user._id },
              // clef secrette pour l'encodage
              process.env.TOKEN_SECRET_ALEATOIRE,
              // durée de vie du token
              { expiresIn: process.env.TOKEN_TEMP }
            ),
          });
        })
        // erreur status 500 Internal Server Error et message en json
        .catch((error) => res.status(500).json({ error }));
    })
    // erreur status 500 Internal Server Error et message en json
    .catch((error) => res.status(500).json({ error }));
};
