// on importe multer
const multer = require("multer");
// on définit les images/formats reçu en appartenance de format ( comme un dictionnaire)
const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/bmp": "bmp",
  "image/gif": "gif",
  "image/x-icon": "ico",
  "image/svg+xml": "svg",
  "image/tiff": "tif",
  "image/tif": "tif",
  "image/webp": "webp",
};
// multer.diskStorage on va enregistrer sur le disque
const storage = multer.diskStorage({
  // on choisit la destination
  destination: (req, file, callback) => {
    // null dit qu'il n'y a pas eu d'erreur à ce niveau la et 'images' c'est le nom du dossier
    callback(null, "images");
  },
  // on definit les termes de son appel (nom)
  filename: (req, file, callback) => {
    // nom d'origine du fichier que l'ont transforme si il y a des espaces, on crée un tableau et on join ses éléments par _
    const name = file.originalname.split(" ").join("_");
    // permet de créer une extension de fichiers correspondant au mimetype (via dictionnaire) envoyé par le frontend
    const extension = MIME_TYPES[file.mimetype];
    // si le fichier correspond à un fichier image https://developer.mozilla.org/fr/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types
    if (
      file.mimetype === "image/jpeg" ||
      file.mimetype === "image/png" ||
      file.mimetype === "image/jpg" ||
      file.mimetype === "image/bmp" ||
      file.mimetype === "image/gif" ||
      file.mimetype === "image/ico" ||
      file.mimetype === "image/svg" ||
      file.mimetype === "image/tiff" ||
      file.mimetype === "image/tif" ||
      file.mimetype === "image/webp"
    ) {
      // aura son nom associé à une date (pour le rendre le plus unique possible) et un point et son extension
      callback(null, name + Date.now() + "." + extension);
      // si ce n'est pas un fichier image
    } else {
      console.log("fichier non accepté");
      // déplace des fichiers non image et on garde des fichiers non conformes pour informations diverses
      // la proposition d'un fichier image est automatique, si une personne choisit volontairement de mettre autre chose, il est fort possible que ce soit malveillant
      // dans le fichier isolé il y a l'id de celui qui est supposé avoir posté le fichier, à voir si une faille usurpation token + id (keylogger ou autre)
      // ou volonté du détenteur du compte
      callback(
        null,
        "isole/" + req.auth.userId + "_" + name + Date.now() + "." + extension
      );
    }
  },
});
// on exporte le fichier via multer qui possede l'objet storage puis .single signifie fichier unique (pas un groupe de fichiers) en disant que c'est un fichier 'image'
// ce nom de fichier sera la key dans form-data de postman (insert File)
module.exports = multer({ storage }).single("image");
