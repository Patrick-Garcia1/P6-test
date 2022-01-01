// on appelle le modèle de la sauce
const Sauce = require("../models/Sauce_model");
// on appelle fs (filesystem) qui permet d'aller dans les fichiers
const fs = require("fs");
const { error } = require("console");
//----------------------------------------------------------------------------------
// LOGIQUE GETALLSAUCE
//----------------------------------------------------------------------------------
// accède à toutes les sauces
exports.getAllSauce = (req, res, next) => {
  // on veut la liste complète de Sauce alors on utilise find() sans argument
  Sauce.find()
    //  status 200 OK et sauces en json
    .then((sauces) => res.status(200).json(sauces))
    // erreur un status 400 Bad Request et l'erreur en json
    .catch((error) => res.status(400).json({ error }));
};
//----------------------------------------------------------------------------------
// LOGIQUE GETONESAUCE
//----------------------------------------------------------------------------------
// accède à une sauce
exports.getOneSauce = (req, res, next) => {
  // on utilise le modele mangoose et findOne pour trouver un objet via la comparaison req.params.id
  Sauce.findOne({ _id: req.params.id })
    // status 200 OK et l'élément en json
    .then((sauce) => res.status(200).json(sauce))
    // si erreur envoit un status 404 Not Found et l'erreur en json
    .catch((error) => res.status(404).json({ error }));
};
//----------------------------------------------------------------------------------
// LOGIQUE CREATESAUCE
//----------------------------------------------------------------------------------
// créait une sauce
exports.createSauce = (req, res, next) => {
  // on extrait le sauce de la requete via le parse
  // dans req.body.sauce le sauce correspont à la key de postman pour ajouter les infos en texte
  const sauceObject = JSON.parse(req.body.sauce);
  // l'user id de la requete doit etre le meme que l'id associé au token (si sur postman une personne rentre dans la data un autre id que celui du token)
  // si la sécurité du token et de l'user id est compromit, revoir authentification via captcha ou autre système plus accessible car risque de keylogger
  // il faut adapter la sécurité au type de donnée potentiellement recueillie malhonnetement par un tier ou donnée délivrée nuisible par usurpation via ce tier
  if (sauceObject.userId !== req.auth.userId) {
    // reponse en status 403 Forbidden avec message json
    res.status(403).json("unauthorized request");
    // détermine si le fichier envoyé est bien une image https://developer.mozilla.org/fr/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types
  } else if (
    req.file.mimetype === "image/jpeg" ||
    req.file.mimetype === "image/png" ||
    req.file.mimetype === "image/jpg" ||
    req.file.mimetype === "image/bmp" ||
    req.file.mimetype === "image/gif" ||
    req.file.mimetype === "image/ico" ||
    req.file.mimetype === "image/svg" ||
    req.file.mimetype === "image/tiff" ||
    req.file.mimetype === "image/tif" ||
    req.file.mimetype === "image/webp"
  ) {
    // déclaration de sauce qui sera une nouvelle instance du modele Sauce qui contient toutes les informations dont on a besoin
    const sauce = new Sauce({
      // raccourci spread pour récupérer toutes les données de req.body ( title description...)
      ...sauceObject,
      // l'image url correspont au protocole avec :// puis la valeur du port (host) dans le dossier images qui a le nom
      imageUrl: `${req.protocol}://${req.get("host")}/images/${
        req.file.filename
      }`,
      // on initialise certains paramètres à la création
      likes: 0,
      dislikes: 0,
      usersLiked: [],
      usersDisliked: [],
    });
    // enregistre l'objet dans la base de donnée
    sauce
      .save()
      // retourne une promesse, il faut une réponse sinon il y a expiration de la requete donc un status 201 Created pour bonne création de ressource + message
      .then(() =>
        res
          .status(201)
          .json({ message: "POST recorded sauce (FR)sauce enregistrée !" })
      )
      // en cas d'erreur on renvoit un status 400 Bad Request et l'erreur
      .catch((error) => res.status(400).json({ error }));
    // si ce qui est envoyé n'est pas un fichier image
  } else {
    // déclaration de sauce qui sera une nouvelle instance du modele Sauce qui contient toutes les informations dont on a besoin
    const sauce = new Sauce({
      // raccourci spread pour récupérer toutes les données de req.body ( title description...)
      ...sauceObject,
      // on met une image par defaut
      // l'image url correspont au protocole avec :// puis la valeur du port (host) dans le dossier images qui a le nom
      imageUrl: `${req.protocol}://${req.get(
        "host"
      )}/images/defaut/imagedefaut.png`,
      // on initialise certains paramètres à la création
      likes: 0,
      dislikes: 0,
      usersLiked: [],
      usersDisliked: [],
    });
    // enregistre l'objet dans la base de donnée
    sauce
      .save()
      // retourne une promesse un status 201 OK pour bonne création de ressource + message
      .then(() =>
        res
          .status(201)
          .json({ message: "POST recorded sauce (FR)sauce enregistrée !" })
      )
      // en cas d'erreur on renvoit un status 400 Bad Request et l'erreur
      .catch((error) => res.status(400).json({ error }));
  }
};
//----------------------------------------------------------------------------------
// LOGIQUE MODIFYSAUCE
//----------------------------------------------------------------------------------
// modifie une sauce
exports.modifySauce = (req, res, next) => {
  // l'id de la sauce est l'id inscrit dans l'url
  Sauce.findOne({ _id: req.params.id })
    // si la sauce existe
    .then((sauce) => {
      // l'id du créateur de la sauce doit etre le meme que celui identifié par le token 
      if (sauce.userId !== req.auth.userId) {
        // reponse en status 403 Forbidden avec message json
        res.status(403).json("unauthorized request");
        // si il y a un fichier avec la demande de modification
      } else if (req.file) {
        // on vérifie que c'est bien une image https://developer.mozilla.org/fr/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types
        if (
          req.file.mimetype === "image/jpeg" ||
          req.file.mimetype === "image/png" ||
          req.file.mimetype === "image/jpg" ||
          req.file.mimetype === "image/bmp" ||
          req.file.mimetype === "image/gif" ||
          req.file.mimetype === "image/ico" ||
          req.file.mimetype === "image/svg" ||
          req.file.mimetype === "image/tiff" ||
          req.file.mimetype === "image/tif" ||
          req.file.mimetype === "image/webp"
        ) {
          // on extrait le sauce de la requete via le parse
          // dans req.body.sauce le sauce correspont à la key de postman pour ajouter les infos en texte
          const sauceObject = {
            ...JSON.parse(req.body.sauce),
            // on ajoute l'image avec ce nom
            imageUrl: `${req.protocol}://${req.get("host")}/images/${
              req.file.filename
            }`,
            //l'user sera celui validé par le token, on ne pourra pas modifier l'appartenance de la sauce dans postman
            userId: req.auth.userId,
          };
          // modifie un sauce dans la base de donnée, 1er argument c'est l'objet qu'on modifie avec id correspondant à l'id de la requete
          // et le deuxième argument c'est la nouvelle version de l'objet qui contient le sauce qui est dans le corp de la requete et que _id correspond à celui des paramètres
          Sauce.updateOne(
            { _id: req.params.id },
            { ...sauceObject, _id: req.params.id }
          )
            // retourne une promesse avec status 201 Created et message en json
            .then(() =>
              res
                .status(201)
                .json({ message: "modified sauce (FR)Objet modifié !" })
            )
            // en cas d'erreur un status 400 Bad Request et l'erreur en json
            .catch((error) => res.status(400).json({ error }));
          // si le fichier n'est pas une image
        } else {
          // on récupère avec le parse req.body.sauce et on y ajoute la nouvelle image
          // dans req.body.sauce le sauce correspont à la key de postman pour ajouter les infos en texte
          const sauceObject = {
            ...JSON.parse(req.body.sauce),
            // l'image sera l'image par defaut
            imageUrl: `${req.protocol}://${req.get(
              "host"
            )}/images/defaut/imagedefaut.png`,
            //l'user sera celui validé par le token, on ne pourra pas modifier l'appartenance de la sauce
            userId: req.auth.userId,
          };
          // modifie un sauce dans la base de donnée, 1er argument c'est l'objet qu'on modifie avec id correspondant à l'id de la requete
          // et le deuxième argument c'est la nouvelle version de l'objet qui contient le sauce qui est dans le corp de la requete et que _id correspond à celui des paramètres
          Sauce.updateOne(
            { _id: req.params.id },
            { ...sauceObject, _id: req.params.id }
          )
            // retourne une promesse avec status 201 Created et message en json
            .then(() =>
              res
                .status(201)
                .json({ message: "modified sauce (FR)Objet modifié !" })
            )
            // en cas d'erreur un status 400 Bad Request et l'erreur en json
            .catch((error) => res.status(400).json({ error }));
        }
        // si il n'y a pas de fichier avec la modification (ps: il garde son image injectée à la création)
      } else {
        const sauceObject = {
          // on récupère avec le parse req.body.sauce et on y ajoute la nouvelle image
          // dans req.body.sauce le sauce correspont à la key de postman pour ajouter les infos en texte
          ...req.body,
          //l'user sera celui validé par le token, on ne pourra pas modifier l'appartenance de la sauce
          userId: req.auth.userId,
        };
        // on met à jour la sauce
        Sauce.updateOne(
          { _id: req.params.id },
          { ...sauceObject, _id: req.params.id }
        )
          // retourne une promesse avec status 201 Created et message en json
          .then(() =>
            res
              .status(201)
              .json({ message: "modified sauce (FR)Objet modifié !" })
          )
          // en cas d'erreur un status 400 Bad Request et l'erreur en json
          .catch((error) => res.status(400).json({ error }));
      }
    })
    // en cas d'erreur 404 Not Found et erreur en json
    .catch((error) => res.status(404).json({ error }));
};
//----------------------------------------------------------------------------------
// LOGIQUE DELETESAUCE
//----------------------------------------------------------------------------------
// efface une sauce
exports.deleteSauce = (req, res, next) => {
  // trouve dans les sauce un _id correspondant à l'id de la requete
  Sauce.findOne({ _id: req.params.id })
    // si il trouve sauce
    .then((sauce) => {
      //variable du nom de l'image de la sauce trouvée
      const nomImage = sauce.imageUrl;
      // variable de l'image sauce par défaut
      const imDefaut = "http://localhost:3000/images/defaut/imagedefaut.png";
      // l'id du créateur de la sauce doit etre le meme que celui identifié par le token sinon
      if (sauce.userId !== req.auth.userId) {
        // reponse en status 403 Forbidden avec message json
        res.status(403).json("unauthorized request");
        // et si nom de l'image sauce est différante de celle par defaut
      } else if (nomImage != imDefaut) {
        // on créait un tableau via l'url et en séparant la partie '/images' et ensuite on recupère l'indice 1 du tableau qui est le nom du fichier
        const filename = sauce.imageUrl.split("/images/")[1];
        // unlink va supprimer le fichier image de la sauce concernée dans le dossier image
        fs.unlink(`images/${filename}`, () => {
          // effacera un sauce et son _id sera la comparaison avec l'id des paramètres de la requete (paramètre de route)
          Sauce.deleteOne({ _id: req.params.id })
            // retourne une promesse status 200 OK et message en json
            .then(() =>
              res
                .status(200)
                .json({ message: "sauce removed (FR)sauce supprimée !" })
            )
            // si erreur status 400 400 Bad Request et erreur en json
            .catch((error) => res.status(400).json({ error }));
        });
        // alors le nom de l'image sauce est celui de celle par defaut
      } else {
        // effacera un sauce et son _id sera la comparaison avec l'id des paramètres de la requete (paramètre de route)
        Sauce.deleteOne({ _id: req.params.id })
          // retourne une promesse status 200 OK et message en json
          .then(() =>
            res
              .status(200)
              .json({ message: "sauce removed (FR)sauce supprimée !" })
          )
          // si erreur status 400 Bad Request et erreur en json
          .catch((error) => res.status(400).json({ error }));
      }
    })
    // erreur 404 Not Found avec erreur en json
    .catch((error) => res.status(404).json({ error }));
};
//----------------------------------------------------------------------------------
// LOGIQUE LIKESAUCE
//----------------------------------------------------------------------------------
// like une sauce
exports.likeSauce = (req, res, next) => {
  // on utilise le modele mangoose et findOne pour trouver un objet via la comparaison req.params.id
  Sauce.findOne({ _id: req.params.id })
    //retourne une promesse avec reponse status 200 OK et l'élément en json
    .then((sauce) => {
      // définition de diverse variables
      let valeurVote;
      let votant = req.body.userId;
      let like = sauce.usersLiked;
      let unlike = sauce.usersDisliked;
      // determine si l'utilisateur est dans un tableau
      let bon = like.includes(votant);
      let mauvais = unlike.includes(votant);
      // ce comparateur va attribuer une valeur de point en fonction du tableau dans lequel il est
      if (bon === true) {
        valeurVote = 1;
      } else if (mauvais === true) {
        valeurVote = -1;
      } else {
        valeurVote = 0;
      }
      // ce comparateur va determiner le vote de l'utilisateur par rapport à une action de vote
      // si l'user n'a pas voté avant et vote positivement
      if (valeurVote === 0 && req.body.like === 1) {
        // ajoute 1 vote positif à likes
        sauce.likes += 1;
        // le tableau usersLiked contiendra l'id de l'user
        sauce.usersLiked.push(votant);
        // si l'user a voté positivement et veut annuler son vote
      } else if (valeurVote === 1 && req.body.like === 0) {
        // enlève 1 vote positif
        sauce.likes -= 1;
        // filtre/enlève l'id du votant du tableau usersLiked
        sauce.usersLiked = unlike.filter(function (f) {
          f != votant;
        });
        // si l'user a voté négativement et veut annuler son vote
      } else if (valeurVote === -1 && req.body.like === 0) {
        // enlève un vote négatif
        sauce.dislikes -= 1;
        // filtre/enlève l'id du votant du tableau usersDisliked
        sauce.usersDisliked = unlike.filter(function (f) {
          f != votant;
        });
        // si l'user n'a pas voté avant et vote négativement
      } else if (valeurVote === 0 && req.body.like === -1) {
        // ajoute 1 vote positif à unlikes
        sauce.dislikes += 1;
        // le tableau usersDisliked contiendra l'id de l'user
        sauce.usersDisliked.push(votant);
        // pour tout autre vote, il ne vient pas de l'index/front donc probabilité de tentative de vote illégal
      } else {
        console.log("tentavive de vote illégal");
      }
      // met à jour la sauce
      Sauce.updateOne(
        { _id: req.params.id },
        {
          likes: sauce.likes,
          dislikes: sauce.dislikes,
          usersLiked: sauce.usersLiked,
          usersDisliked: sauce.usersDisliked,
        }
      )
        // retourne une promesse avec status 201 Created et message en json
        .then(() => res.status(201).json({ message: "Vous venez de voter" }))
        // en cas d'erreur un status 400 et l'erreur en json
        .catch((error) => {
          if (error) {
            console.log(error);
          }
        });
    })
    // si erreur envoit un status 404 Not Found et l'erreur en json 
    .catch((error) => res.status(404).json({ error }));
};
