import 'reflect-metadata'; // user for interceptors to retrieve the password from the response to the client
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from "express-session"; // "express-session" this is a middleware et on a fait sa configuration f had le file "main" alors chaque request fl app ghadi itseft m3aha l'object session khassni ghir ndiro l'annotation @Session fles fcts handlers pour recuperer l'object sessoin
import * as passport from "passport";
import { TypeormStore } from 'connect-typeorm';
import { DataSource } from 'typeorm';
import { SessionEntity } from './typeorm/entities/Session';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const sessionRepository = app.get<DataSource>(DataSource).getRepository(SessionEntity); //app.get<DataSource(DataSource).getRepository(SessionEntity): After creating the Nest.js application, you are obtaining the sessionRepository by calling the get method on the application instance. app.get is used to retrieve instances of components (services, repositories, etc.) registered within the Nest.js application. In this case, it's obtaining the getRepository method of the TypeORM DataSource instance for the SessionEntity. DataSource is a TypeORM class/interface that represents a connection to the database. getRepository is a method provided by TypeORM to get a repository for a specific entity (in this case, SessionEntity). So, app.get<DataSource(DataSource).getRepository(SessionEntity); is essentially retrieving the getRepository method for SessionEntity from the TypeORM DataSource.
  app.use( // setting up the session
    session({
      name: "NESTJS_SESSION_ID", // Specifies the name of the session cookie. In this case, it's set to "NESTJS_SESSION_ID".
      secret: "FLJD029874JDHEOIU2J4987982JD", // Cette option spécifie la clé secrète utilisée pour signer le cookie de session. La clé secrète est utilisée pour garantir l'intégrité du cookie et éviter la falsification.
      resave: false, // L'option resave indique si la session doit être enregistrée à chaque requête, même si elle n'a pas été modifiée. Si cette option est false, la session ne sera enregistrée que si des modifications ont été apportées, ce qui peut améliorer les performances.
      saveUninitialized: false, // L'option saveUninitialized indique si une session non initialisée (nouvelle) doit être enregistrée. Si cette option est false, les sessions ne seront enregistrées que si elles ont été modifiées, ce qui peut être utile pour économiser des ressources sur le serveur. (par exemple un visiteur de l'app web non authentifiée c'est pas la peine de creer une session pour un user qui n'est pas authentifié), si ç'est true la session sera enregistré et on aura le meme session id chaque fois qu'on envoie une requette à partir du meme client, Mais the best practice howa anaho tkheli had l'option b false ou dir un popup fl front li kigoul l'user éiactiver l coockies bach tsetta had la valeur b true ou tsava 3dna session
      cookie: { // La propriété cookie permet de configurer les paramètres du cookie de session. maxAge : La durée de validité du cookie de session en millisecondes. Dans cet exemple, le cookie expirera après 60 000 millisecondes (60 secondes) depuis sa création.
        maxAge: 60000, //expires in 60000 ms
        httpOnly: true, // using the HttpOnly cookies
      },
      store: new TypeormStore({
        cleanupLimit: 2, // For every new session, remove this many expired ones (does not distinguish between users, so User A logging in can delete User B expired sessions). Defaults to 0, in case you need to analyze sessions retrospectively.
        limitSubquery: false, // Select and delete expired sessions in one query. Defaults to true, you can set false to make two queries, in case you want cleanupLimit but your MariaDB version doesn't support limit in a subquery.
      }).connect(sessionRepository), // configuration d'un session store pour stocker les données de session de chaque user || new TypeormStore(): This creates a new instance of the TypeormStore class. TypeormStore is a class provided by the typeorm-store package, and it's used to store session data in a TypeORM repository. .connect(sessionRepository): The connect method of TypeormStore is then called with sessionRepository as an argument. This establishes a connection between the TypeormStore and the TypeORM repository (sessionRepository) for storing and retrieving session data.
    }),
  );
  app.use(passport.initialize()); // Initializes Passport.js. This middleware is required to use Passport in your application.
  app.use(passport.session()); //  Enables Passport to use sessions. It's typically used after express-session to support persistent login sessions.
                              // In summary, this configuration sets up session management using express-session with specific options. It also initializes and configures Passport.js for authentication. The combination of these middleware components allows your NestJS application to handle user sessions and authentication using Passport strategies. The order in which these middlewares are applied is essential, and express-session should come before passport.session() to ensure proper session handling.
  await app.listen(3001);
}
bootstrap();










/*
  
Un "session store" (ou "magasin de sessions") est un composant logiciel qui stocke les données de session utilisateur. Dans le contexte des applications web, une session est un mécanisme qui permet de stocker des informations spécifiques à un utilisateur entre les différentes requêtes HTTP, généralement pendant la durée de sa visite sur le site.

Lorsqu'un utilisateur se connecte à une application web, un identifiant de session unique est généralement attribué à cette session. Les données associées à cette session, telles que les préférences utilisateur, les informations d'authentification, etc., sont stockées temporairement dans le magasin de sessions. Lorsque l'utilisateur effectue d'autres requêtes, l'application peut récupérer ces données à partir du magasin de sessions en utilisant l'identifiant de session.

Il existe plusieurs types de magasins de sessions, chacun ayant ses propres caractéristiques et méthodes de stockage. Voici quelques exemples courants :

Memory Store :

Stocke les données de session en mémoire volatile. Les données sont perdues si le serveur est redémarré.
Simple et rapide, mais ne convient généralement pas pour les applications en production en raison de la perte de données en cas de panne du serveur.
Cookie Store :

Stocke les données de session dans les cookies du navigateur de l'utilisateur.
Limité en termes de capacité de stockage (les cookies ont une taille maximale) et peut poser des problèmes de sécurité.
Database Store :

Stocke les données de session dans une base de données (par exemple, MySQL, PostgreSQL, MongoDB).
Plus robuste et adapté aux applications en production. Les données sont persistantes même en cas de redémarrage du serveur.
Redis Store :

Utilise Redis comme magasin de sessions. Redis est une base de données en mémoire rapide et légère.
Offre des performances élevées et une persistance optionnelle.
File System Store :

Stocke les données de session dans des fichiers sur le système de fichiers du serveur.
Peut être utilisé pour des applications légères, mais moins performant que les magasins basés sur la mémoire ou les bases de données.
*/ 