import * as bcrypt from "bcrypt";

// const SALT = 10; si je veux que le SALT soit le meme pour tjrs
export function encodePassword(rawPassword : string){
    const SALT = bcrypt.genSaltSync(); // pour que à chaque fois ikoun 3dna un SALT different (le Salt ici ce genere automatiquement)
    return bcrypt.hashSync(rawPassword, SALT);
}

export function comparePasswords(rawPassword : string, hashedPassword : string){
    return bcrypt.compareSync(rawPassword, hashedPassword);
}