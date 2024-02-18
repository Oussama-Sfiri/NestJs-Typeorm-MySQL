import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Profile } from "./Profile";
import { Post } from "./Post";
import { Exclude } from "class-transformer";

@Entity({ name: "user" })
export class User {
    @PrimaryGeneratedColumn({ type: "bigint" }) // { type: "bigint" } setting the data type of the id to a "bigint" çàd "Long"
    id : number;

    @Column({ unique: true })
    username : string;

    @Column()
    @Exclude() // pour que le password soit exclus de la reponse quand on return la response au client mais fl la base de données il va etre present
    password : string;

    @Column()  //@Column({ default : Date.now }) mais on a trouver des probleme
    createdAt : Date;

    @Column({ nullable: true })
    authStrategy: string;

    @OneToOne(() => Profile)
    @JoinColumn()
    profile : Profile;

    @OneToMany(() => Post, (post) => post.user)
    posts : Post[];
}