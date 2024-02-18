import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common"; // ExecutionContext: Il fournit le contexte d'exécution actuel de NestJS, qui donne accès à des informations sur la requête en cours.
import { AuthGuard } from "@nestjs/passport";
import { Request } from "express";

@Injectable()
export class LocalAuthGuard extends AuthGuard("local") { // this guard is used to invoke passport and to protect routes but to protect guards il vaut mieux creer un autre guard

    async canActivate(context: ExecutionContext) { // La méthode canActivate est appelée par le mécanisme de garde pour déterminer si l'accès à la route doit être autorisé ou non.
        const result = (await super.canActivate(context)) as boolean; // Appelle la méthode canActivate de la classe parente (AuthGuard) de manière asynchrone pour effectuer la vérification d'authentification.
        const request = context.switchToHttp().getRequest(); // Obtient l'objet de requête à partir du contexte d'exécution.
        await super.logIn(request); // Authentifie l'utilisateur et initialise la session de l'utilisateur en utilisant la méthode logIn de la classe parente (AuthGuard).
        return result; // Renvoie le résultat de la vérification d'authentification, permettant à la requête d'être traitée si l'utilisateur est authentifié avec succès.
    }

};



@Injectable()
export class AuthenticatedGuard implements CanActivate { // ce guard est utiliser pour protoger les routes çàd checker est-ce-que l'user est authentifier avant d'acceder a des ressources ou envoyer des requettes si il est authentifier la requette passe bien revoie le status 200, sinon elle renvoie le status 403 et la request ne sera pas executée

    async canActivate(context: ExecutionContext): Promise<any> {
        const req = context.switchToHttp().getRequest<Request>();
        console.log(req.isAuthenticated())
        return req.isAuthenticated(); //Si l'utilisateur est authentifié, req.isAuthenticated() renverra true, et la méthode canActivate renverra également true, permettant l'accès à la ressource protégée (/status). Si l'utilisateur n'est pas authentifié, req.isAuthenticated() renverra false, et la méthode canActivate renverra false, empêchant l'accès à la ressource protégée. Cela déclenchera probablement une réponse HTTP avec le statut 403 (forbidden).
    }

}



















/*logIn(request) : La méthode logIn de Passport.js est utilisée pour authentifier l'utilisateur et initialiser sa session. Elle prend en paramètre l'objet de requête (request) qui contient les informations sur la requête HTTP en cours.

Objectif de logIn : Passport.js maintient une session utilisateur pour gérer l'état d'authentification entre les requêtes. La méthode logIn est responsable de l'initialisation de la session utilisateur.

Processus :

Lorsqu'un utilisateur est authentifié avec succès, logIn crée une session utilisateur et stocke les informations d'authentification dans cette session.
Passport.js peut utiliser ces informations lors des requêtes ultérieures pour déterminer si l'utilisateur est authentifié.
Paramètre request : L'objet request est passé à la méthode logIn pour permettre à Passport.js d'accéder aux détails de la requête et d'extraire les informations d'authentification nécessaires.

Asynchrone : Comme l'opération de logIn peut être asynchrone (par exemple, si elle implique des accès à la base de données), l'utilisation de await garantit que la méthode canActivate attend la fin de cette opération avant de continuer.

Résultat : Cette opération modifie généralement l'état interne de Passport.js pour indiquer que l'utilisateur est authentifié et peut être utilisé pour d'autres vérifications d'autorisation dans l'application. */