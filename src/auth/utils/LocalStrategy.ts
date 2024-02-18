import { Inject, Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { AuthService } from "../services/auth/auth.service";

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy){
    constructor(@Inject("AUTH_SERVICE") private readonly authService : AuthService){
        super({
            // usernameField : "email" optional
        });
    }

    async validate(username : string, password : string) {
        console.log("Inside LocalStrategy.validate");
        console.log(username);
        console.log(password);
        const user = await this.authService.validateUser(username, password);
        if(!user){
            throw new UnauthorizedException();
        }else{
            return user; // If a user is found and the credentials are valid, the user is returned so Passport can complete its tasks (e.g., creating the user property on the Request object), and the request handling pipeline can continue. If it's not found, we throw an exception and let our exceptions layer handle it. || In the LocalStrategy class, the validate method is responsible for validating the user's credentials (username and password) and returning the user object if the validation is successful. The user object returned by the validate method will be attached to the request object and can be accessed in subsequent request handlers or controllers.
        }
    }
}