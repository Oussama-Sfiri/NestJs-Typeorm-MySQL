import { Inject, Injectable } from "@nestjs/common";
import { PassportSerializer } from "@nestjs/passport";
import { User } from "src/typeorm/entities/User";
import { UsersService } from "src/users/services/users/users.service";

@Injectable()
export class SessionSerializer extends PassportSerializer {

    constructor(@Inject("USER_SERVICE") private readonly userService : UsersService) {
        super();
    }

    // REMARQUE IMPORTANTE : 1erement quand l'user fait le login la methode "validate" dans le file strategy va etre invoquée pour verifier l'existence de ce user dans la base de donéees çàd est ce que l'user admet un compte çàd authentifier, si l'user est authentifier ou lui reserve une session et on la envoie pour etre stocker dans son browser pour que à chaque requette envoyer par ce user on peut savoir qui est l'user qui a envoyer cette requette , cette allocation de sessions (ou appellé serialization et deserialization) est faite par le file "SessionSerializer.ts" , la methode "serializeUser" define what properties should be stored in the session and it send this session to the client "Browser" for example "serializeUser" stores only the user id in the session "done(null, user.id);" donc la session envoyer au client va contenir seulement l'user id, quand ce client va envoyer des requettes pour chaque requette le client envoie l'bobject session stocker chez lui qui contient son user id alors la methode "deserializeUser" va prendre cette session et elle va extraire son "payload" (le payload represente dkchi li stockena f session f la methode serializeUser (dans notre cas on a stocker juste l'user id)) qui est dans ce cas l'user id et à partir de cet user id elle va fetcher tous les infos (l'object) de ce user à partir du database pour que finalement elle attache cet object user avec la request (request.user) pour faire des traitement (modification de la session ....)

    /*
    1. Méthode serializeUser: La méthode serializeUser est appelée lorsqu'un utilisateur se connecte avec succès. Elle détermine quelles informations doivent être stockées dans la session (généralement une clé unique, comme l'identifiant de l'utilisateur) pour identifier 
        ======> Dans ce cas, done(null, user) indique que la sérialisation s'est terminée avec succès, et l'ensemble de l'objet utilisateur (user) est stocké dans la session.
    2. Méthode deserializeUser: La méthode deserializeUser est appelée lorsqu'une requête ultérieure est effectuée. Elle est responsable de la récupération des données utilisateur à partir de la session et de la reconstruction de l'objet utilisateur complet
        ======> Dans ce cas, done(null, userDB) indique que la désérialisation s'est terminée avec succès, et l'objet utilisateur reconstruit (userDB) est renvoyé. Si l'utilisateur n'est pas trouvé dans la base de données, done(null, null) est utilisé pour indiquer que la désérialisation a échoué.
    */

    serializeUser(user: User, done: (err, user: User) => void) {
        console.log("SerializeUser...");
        // done(null, user.id); // Serialize user by storing the user ID in the session || dans ce cas on store juste l'user id dans la session et on l'envoi
        done(null, user); // This method is called during the login process. Its purpose is to determine what user data should be stored in the session. In this case, it simply stores the entire user object in the session. (request.user)
    };

    async deserializeUser(user: User, done: (err, user: User) => void) {
        console.log("DeserializeUser...");
        // Deserialize user by fetching user details from the database based on the stored user ID
        const userDB = await this.userService.findUserByID(user.id);
        // Check if the user exists in the database
        return userDB? done(null, userDB) : done(null, null);
    };

    






    // async deserializeUser(id: string, done: (error: Error | null, user?: any) => void): Promise<void> {
    //     try {
    //         const user = await userService.findUserById(id);
    
    //         if (!user) {
    //             // Si l'utilisateur n'est pas trouvé dans la base de données
    //             return done(null, false);
    //         }
    
    //         // Si l'utilisateur est trouvé avec succès dans la base de données
    //         return done(null, user);
    //     } catch (error) {
    //         // En cas d'erreur pendant la désérialisation de la session
    //         return done(error);
    //     }
    // }





    // Le cas où on serialise juste l'user id çàd on stocke juste l'user id dans la session

    //   serializeUser(user: User, done: (err: Error, id?: any) => void): void {
    //     done(null, user.id); // Serialize user by storing the user ID in the session
    //   }
    
    //   async deserializeUser(id: any, done: (err: Error, payload?: User) => void): Promise<void> {
    //     const user = await findUserById(id); // Fetch user details from the database using the stored ID
    //     done(null, user);
    //   }


    /*-------------------- MANIERE GENERALE --------------------------*/
    // serializeUser(user: any, done: (err: Error, user: any) => void): any {
    //     done(null, user)
    // } // Purpose: This method is called during the login process. Its purpose is to determine what user data should be stored in the session. In this case, it simply stores the entire user object in the session.
        // Parameters:
        // user: The user object retrieved during the login process.
        // done: A callback function that should be called once the user data is serialized.

    // deserializeUser(payload: any, done: (err: Error, payload: string) => void): any {
    //     done(null, payload)
    // } //Purpose: This method is called on every subsequent request to deserialize the user data stored in the session. In this case, it simply returns the stored payload.
        // Parameters:
        // payload: The data stored in the session, typically a user identifier.
        // done: A callback function that should be called once the user data is deserialized.

}








/*

Certainly! Let's go through the process of how session serialization and deserialization work on subsequent requests in a NestJS application with Passport.js:

User Login (Initial Request):

When a user logs in, Passport's validate method is called in the LocalStrategy.
In the validate method, you typically retrieve the user's details from the database based on the provided username and password.
Once the user is validated, Passport serializes the user by storing a unique identifier (e.g., user ID) in the session.
Subsequent Requests:

On subsequent requests, the client's browser includes the session cookie (containing the serialized user data) in the request headers.
Passport Session Middleware:

Passport's session middleware, configured with PassportModule.register({ session: true }), is responsible for automatically deserializing the user from the session on each request.
The session middleware retrieves the unique identifier (e.g., user ID) from the session cookie.
Deserialize User (Every Request):

Passport invokes the deserializeUser method of the configured SessionSerializer to reconstruct the complete user object based on the stored identifier.
The deserializeUser method typically involves fetching the user's details from the database using the stored identifier.










In the context of web applications and authentication, session serialization and deserialization are critical concepts, especially when dealing with persistent login sessions. These processes are often handled by authentication middleware like Passport.js. Let's break down what session serialization and deserialization mean:

Session Serialization:
Definition: Serialization is the process of converting an object (in this case, a user object) into a format that can be easily stored, transmitted, or reconstructed.

Purpose: When a user logs in, their user details (such as user ID) are serialized into a format that can be stored in the session. This serialized data is then sent to the client as a session cookie.

Example (Passport.js): Passport.js typically serializes the user object by storing its unique identifier in the session. For example, if the user object has a unique ID field, only that ID is serialized.

Session Deserialization:
Definition: Deserialization is the reverse process of serialization. It involves reconstructing an object from its serialized format.

Purpose: When a user makes a subsequent request, the session cookie is sent back to the server. The server then deserializes the data from the session cookie to reconstruct the user object.

Example (Passport.js): Passport.js deserializes the user object by using the stored identifier (e.g., user ID) to fetch the complete user details from the database. This allows the application to have access to the user's full details during the request.
*/