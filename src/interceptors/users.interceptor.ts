import { CallHandler, ExecutionContext, HttpStatus, Injectable, NestInterceptor } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { Observable, map, tap } from "rxjs";
import { User } from "src/typeorm/entities/User";

@Injectable()
export class UsersInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler<User[]>): Observable<any[]> | Promise<Observable<any[]>> {
        // User[] indique le type de données que la fonction handler de la request retunrs dans ce cas la fct retunrs un array of "User"
        const req = context.switchToHttp().getRequest();
        console.log(req.body);

        return next.handle().pipe(
            map((res) => {
                return res.map((user) => {
                    return plainToInstance(User, user); // cette fonction katched chaque object "user" dans l'array "res" ou kat7owel lih la forme dyalo l nesfss la forme dyl la classe "User" et puisque derna f la classe "User" @Exclude l password field donc chaque object "user" ghadi it7iyed mno lfield "password" 
                })
            })
        );

    }
}



// Methode general sans principe de nest (npm i class-transformer reflect-metadata)
// @Injectable()
// export class UsersInterceptor implements NestInterceptor {
//     intercept(context: ExecutionContext, next: CallHandler<User[]>): Observable<User[]> | Promise<Observable<User[]>> {
//         // User[] indique le type de données que la fonction handler de la request retunrs dans ce cas la fct retunrs un array of "User"
//         const req = context.switchToHttp().getRequest();
//         console.log(req.body);

//         return next.handle().pipe(
//             map((res) => {

//                 let modifiedResponse: any[];
//                 modifiedResponse = res.map(user => {
//                     const {password, ...userDetails} = user;
//                     return userDetails;
//                 });
//                 console.log(modifiedResponse);
//                 // return modifiedResponse; n9edro ndiro ghir haka ou ghadi tssift lina response mbedla mais hna bghina nt7ekmo hta fl status dyl response
//                 const response = context.switchToHttp().getResponse();
//                 response.status(HttpStatus.OK).json(modifiedResponse);
//                 return response;

//             })
//         );

//     }
// }