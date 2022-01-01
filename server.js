// Les projets Node sont initialisés avec la commande  npm init
// importer le package/module http de node; require() est la commande pour importer le package/module
const http = require("http");
// importe le fichier de l'application ( pas besoin de mettre .js, il reconnait)
const app = require("./app");
//----------------------------------------------------------------------------------
// GARDE CORP SECURITE
//----------------------------------------------------------------------------------
//   Cette fonction est un garde-corps de sécurité pour s’assurer que le port fourni est number sinon un nombre alors un string et si quoi que ce soit d’autre, définissez-le sur false
//	 la fonction normalizePort renvoie un port valide, qu'il soit fourni sous la forme d'un numéro ou d'une chaîne
const normalizePort = (val) => {
  //Exécute parseInt, qui convertit essentiellement la valeur en un entier, si possible.
  const port = parseInt(val, 10);
  // si port n'est pas un nombre   isNaN(port)
  if (isNaN(port)) {
    // retourne val
    return val;
  }
  //  si port est un nombre sup ou égal à 0
  if (port >= 0) {
    // retourne port
    return port;
  }
  // sinon retourne faux
  return false;
};
// constante port qui définit le port
// const port = normalizePort(process.env.PORT || '3000');
const port = normalizePort(process.env.PORT || "3000");
// dit à l'application express quelle doit tourner sur le 'port' avec la constante port
app.set("port", port);
//----------------------------------------------------------------------------------
// DIPLOMATIE DES ERREURS
//----------------------------------------------------------------------------------
// la fonction errorHandler  recherche les différentes erreurs et les gère de manière appropriée. Elle est ensuite enregistrée dans le serveur ;
const errorHandler = (error) => {
  // si le server n'entend rien à l'appel
  if (error.syscall !== "listen") {
    // lance une erreur
    throw error;
  }
  // au cas d'une erreur code
  switch (error.code) {
    // EACCES est autorisation refusée
    case "EACCES":
      console.error(error);
      // process.exit(1) signifie mettre fin au processus avec un échec. process.exit(0) signifie mettre fin au processus sans échec
      process.exit(1);
      // fin
      break;
    // EADDRINUSE veut dire que l'adresse cherchée est en cour d'utilisation
    case "EADDRINUSE":
      console.error(error);
      // process.exit(1) signifie mettre fin au processus avec un échec. process.exit(0) signifie mettre fin au processus sans échec
      process.exit(1);
      //fin
      break;
    // par défaut
    default:
      // lance une erreur
      throw error;
  }
};
//----------------------------------------------------------------------------------
// SERVEUR
//----------------------------------------------------------------------------------
// on passe cette application app en argument pour créer le serveur
const server = http.createServer(app);
// si le server est en erreur appelle la fonction errorHandler qui gère les erreurs
server.on("error", errorHandler);
// un écouteur d'évènements est également enregistré, consignant le port ou le canal nommé sur lequel le serveur s'exécute dans la console.
server.on("listening", () => {
  // on peut écrire ça
  //console.log(`Listening on port ${process.env.PORT} (FR)écoute sur le port ${process.env.PORT}`);
  console.log(
    "Listening on port " +
      process.env.PORT +
      "(FR)écoute sur le port " +
      process.env.PORT
  );
});
// attend et ecoute les requetes envoyées; par defaut en développement on utilise le port 3000 et quand il n'est pas disponible la version spare process.env.PORT
server.listen(port);
