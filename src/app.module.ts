import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './typeorm/entities/User';
import { UsersModule } from './users/users.module';
import { Profile } from './typeorm/entities/Profile';
import { AuthModule } from './auth/auth.module';
import { Post } from './typeorm/entities/Post';
import { SessionEntity } from './typeorm/entities/Session';

@Module({
  imports: [UsersModule, AuthModule,
    TypeOrmModule.forRoot({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "",
    database: "nestjs-test",
    // entities: [User, Profile, Post, SessionEntity],
    autoLoadEntities: true,
    synchronize: true,
  })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
