import { Controller, Get, Post, Req, Session, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { AuthenticatedGuard, LocalAuthGuard } from 'src/auth/utils/LocalAuthGuard';

@Controller('auth')
export class AuthController {

    // @UseGuards(AuthGuard("local")) // had lguard howa li kiched l'object request 9bel maymchi l la fct handler ou kisifto l LocalStrategy bach nstekhdmo les info li tsifto
    @UseGuards(LocalAuthGuard) // meme chose que li fo9 mais de preference ndiro custom guard dyalna qui extends AuthGuard("local") fach nbghiw nkhedmo b passport et sessions bach had lguard ifhem les fcts serializeUser et DeserializeUser
    @Post("login")
    async login(@Req() req) {
        return req.user; // If a user is found and the credentials are valid, the user is returned so Passport can complete its tasks (e.g., creating the user property on the Request object), and the request handling pipeline can continue. If it's not found, we throw an exception and let our exceptions layer handle it. || In the LocalStrategy class, the validate method is responsible for validating the user's credentials (username and password) and returning the user object if the validation is successful. The user object returned by the validate method will be attached to the request object and can be accessed in subsequent request handlers or controllers.
    }

    // To test the session
    @Get()
    async getAuthSeesion(@Session() session : Record<string,any>) { // The @Session() decorator is used to inject the session data into the session parameter. The session parameter is of type Record<string, any>, indicating that it's a generic object with string keys and any values.
        console.log(session);
        console.log("Session ID: " + session.id);

        // REMARQUE: As soon as you modify a session that is when it's concerened initialised donc automatiquement l'option "saveUninitialized: false" (voir le file main) katrje3 b true et donc la session katenregistra fl browser dyl lclient et il expires aprés l'ecoulement du temps specifier dans ce cas 60000ms = 60s
        session.authenticated = true; // ici on a modifier session dans il sera enregistrer
        return session;
    }

    // to protect this route using the guard of the authentication
    @UseGuards(AuthenticatedGuard)
    @Get("status")
    getAuthStatus(@Req() req : Request) {
        return req.user;
    }
    
}
