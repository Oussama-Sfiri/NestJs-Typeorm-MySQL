import { Inject, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/services/users/users.service';
import { comparePasswords } from 'src/utils/bcrypt';

@Injectable()
export class AuthService {

    constructor(@Inject("USER_SERVICE") private readonly userService : UsersService){}

    async validateUser(username : string, password : string){
        console.log("Inside validateUser")
        const userDB = await this.userService.findUserByUsername(username);
        if(userDB){ // if(userDB && userDB.password === password){ avant l'utilisation de bcrypt
            const matched = comparePasswords(password, userDB.password); // comparing the two passwords
            if(matched){
                console.log("User Validation Success!");
                return userDB;
            }else{
                console.log("Wrong Password");
                return null;
            }
        }else{
            console.log("User Validation Failed!");
            return null;
        }
    }

}
