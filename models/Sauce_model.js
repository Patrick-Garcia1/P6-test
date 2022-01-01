// on a besoin du package mangoose pour créer un shéma et on a besoin de l'importer
const mongoose = require("mongoose");
// création d'un schéma de données qui contient les champs souhaités pour chaque Sauce
// indique leur type ainsi que leur caractère (obligatoire ou non) grace à la méthode Schema mise à disposition par Mongoose
// Pas besoin de mettre un champ pour l'Id puisqu'il est automatiquement généré par Mongoose
const sauceSchema = mongoose.Schema({
  userId: { type: String, required: true },
  name: { type: String, required: true },
  manufacturer: { type: String, required: true },
  description: { type: String, required: true },
  mainPepper: { type: String, required: true },
  imageUrl: { type: String, required: true },
  heat: { type: Number, required: true },
  likes: { type: Number },
  dislikes: { type: Number },
  usersLiked: { type: [String] },
  usersDisliked: { type: [String] },
});
// nous exportons ce schéma en tant que modèle Mongoose appelé « Sauce », le rendant par là même disponible pour notre application Express.
// Ce modèle vous permettra non seulement d'appliquer notre structure de données, mais aussi de simplifier les opérations de lecture et d'écriture dans la base de données
// La méthode  model  transforme ce modèle en un modèle utilisable; lire/enregistrer dans la base de données et interagir avec la base donnée mongodb
// le Sauce se contruit selon le modèle sauceSchema
module.exports = mongoose.model("Sauce", sauceSchema);
