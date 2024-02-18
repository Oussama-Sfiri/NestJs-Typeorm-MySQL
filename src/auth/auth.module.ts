import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth/auth.controller';
import { AuthService } from './services/auth/auth.service';
import { UsersService } from 'src/users/services/users/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/typeorm/entities/User';
import { Profile } from 'src/typeorm/entities/Profile';
import { Post } from 'src/typeorm/entities/Post';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './utils/LocalStrategy';
import { SessionSerializer } from './utils/SessionSerializer';
import { SessionEntity } from 'src/typeorm/entities/Session';

@Module({
  imports: [TypeOrmModule.forFeature([User, Profile, Post, SessionEntity]), 
    PassportModule.register({  // REMARQUE: PassportModule.register for configuring Passport with session support. The PassportModule.register method is used to set up Passport with specific options, including session support. Configures Passport with session support.   The session: true option indicates that Passport should support session serialization and deserialization. This is crucial when dealing with persistent login sessions.
      session: true,
    })
  ],
  controllers: [AuthController],
  providers: [
    { // cette methode allow us to type annotate your services with interfaces whereas if you just actually were to inject it without the Token then you would be limited to programming to the implemebtation rather than interface
      provide: "AUTH_SERVICE", // Token
      useClass: AuthService,
    },
    {
      provide: "USER_SERVICE", // Token
      useClass: UsersService,
    },
    LocalStrategy,
    SessionSerializer
  ] // == providers: [AuthService]
})
export class AuthModule {}
