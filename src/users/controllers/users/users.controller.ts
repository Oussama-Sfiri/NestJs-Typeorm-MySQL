import { Body, Controller, Delete, Get, HttpException, Param, ParseIntPipe, Post, Put, UseInterceptors } from '@nestjs/common';
import { UserErrorInterceptor } from 'src/interceptors/error.interceptor';
import { UsersInterceptor } from 'src/interceptors/users.interceptor';
import { CreateUserDto } from 'src/users/dtos/CreateUser.dto';
import { CreateUserPostDto } from 'src/users/dtos/CreateUserPost.dto';
import { CreateUserProfileDto } from 'src/users/dtos/CreateUserProfile.dto';
import { UpdateUserDto } from 'src/users/dtos/UpdateUser.dto';
import { UsersService } from 'src/users/services/users/users.service';

@Controller('users')
export class UsersController {
    constructor(private readonly userService : UsersService){}

    @Get()
    @UseInterceptors(UsersInterceptor)
    getUsers() {
        const users = this.userService.findUsers();
        return users;
    };

    @Post()
    createUser(@Body() userDetails : CreateUserDto) {
        const createdUser  = this.userService.createUser(userDetails);
        return createdUser;
    };

    @Put(":id")
    updateUserById(@Param("id", ParseIntPipe) id : number, @Body() userUpdateDetails : UpdateUserDto) {
        return this.userService.updateUser(id, userUpdateDetails);
    };

    @Delete(":id")
    deleteUserById(@Param("id", ParseIntPipe) id : number) {
        return this.userService.deleteUser(id);
    };

    @Post(":id/profiles") // ici derna :id bach n3erfo l'id dyl l'user li ghadin n2associew lih le profile qu'on va creer mais c'est pas necessaire cas dans le cas reel dans une application reele li fiha l'anthentification on peut savoir l'id de user d'apres "session" ou "req.user" ou en utilisant "passport"
    createUserProfile(@Param("id", ParseIntPipe) userId : number, @Body() userProfile : CreateUserProfileDto) {
        return this.userService.createUserProfile(userId, userProfile);
    };

    @Post(":id/posts")
    createUserPost(@Param("id", ParseIntPipe) userId : number, @Body() userPost : CreateUserPostDto) {
        return this.userService.createUserPost(userId, userPost);
    };


    // Just an example for the UserErrorInterceptor
    @Post("error")
    @UseInterceptors(UserErrorInterceptor)
    postUser(){
        throw new HttpException("Bad Request", 400);
    };

}
