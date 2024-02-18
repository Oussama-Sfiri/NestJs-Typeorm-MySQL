import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from 'src/typeorm/entities/Post';
import { Profile } from 'src/typeorm/entities/Profile';
import { User } from 'src/typeorm/entities/User';
import { encodePassword } from 'src/utils/bcrypt';
import { CreateUserPostType, CreateUserProfileType, CreateUserType, UpdateUserType } from 'src/utils/types';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {

    constructor(@InjectRepository(User) private userRepo : Repository<User>,
                @InjectRepository(Profile) private profileRepo : Repository<Profile>,
                @InjectRepository(Post) private postRepo : Repository<Post>
    ){}

    async findUsers(){
        return await this.userRepo.find({relations: ["profile", "posts"]}); // on a passer cette proprieté ({relations: ["profile"]}) car f ach kanbghiw nfetchew les données d'un user makit3tanach le field "profile" car c'est une relation avec une autre entité qui est "Profile" c'est pour cela on a specifier la colone qui represente la relation bach hta hiya ijibha lina m3a les données dyl l'user. on peut specifier plusieurs relations car c'est sous forme d'un array (ex: {relations: ["profile", "creditCards"]}) on passe le nom des fields dans l'entité
    };

    async createUser(userDetails : CreateUserType){
        const encryptedPassword = encodePassword(userDetails.password);
        console.log(encryptedPassword)
        const newUser = this.userRepo.create({...userDetails, password: encryptedPassword, createdAt: new Date()})
        return await this.userRepo.save(newUser);
    };

    async updateUser(id : number, userUpdateDetails : UpdateUserType){
        return await this.userRepo.update({ id },{ ...userUpdateDetails }); // or return await this.userRepo.update(id,userUpdateDetails);
    };

    async deleteUser(id : number){
        return await this.userRepo.delete(id);
    };

    async createUserProfile(userId : number, userProfile : CreateUserProfileType){
        const user = await this.userRepo.findOneBy({ id: userId });
        if(!user){
            throw new HttpException("User Not Found. Cannot create Profile", HttpStatus.BAD_REQUEST);
        }else{
            // creation du profile
            const newProfile = this.profileRepo.create(userProfile)
            const savedProfile = await this.profileRepo.save(newProfile);
            //Update de user profile par le new profile crée et sauvegardage de user avec les nouveau changement
            user.profile = savedProfile;
            return await this.userRepo.save(user);
        }
    };

    async createUserPost(userId : number, userPost : CreateUserPostType) {
        const user = await this.userRepo.findOneBy({ id: userId});
        if(!user){
            throw new HttpException("User Not Found. Cannot create Post", HttpStatus.BAD_REQUEST);
        }else{
            // creation du profile
            const newPost = this.postRepo.create({ ...userPost, user }); // on a passer le "user" qu'on a trouver pour que le post soit lier au user touver çàd qui a creer ce post
            const savedPost = await this.postRepo.save(newPost);
            return savedPost;
        } // ici automatiquement l'array de "posts" de l'user ki3mer b les post li creea l'user
    };


    // The method below is for the Auth Module
    async findUserByUsername(username : string) {
        return await this.userRepo.findOne({ where: {username: username}, relations: ["profile", "posts"]});
    };

    // the methode below is for the pasport an session serialization and deserialization
    async findUserByID(userID : number) {
        return await this.userRepo.findOne({ where: {id: userID} });
    }
}
