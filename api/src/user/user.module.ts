import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserEntity } from 'src/entities/UserEntity';
import { MikroOrmModule } from '@mikro-orm/nestjs';

@Module({
  controllers: [UserController],
  imports: [MikroOrmModule.forFeature({ entities: [UserEntity] })],
  providers: [UserService],
})
export class UserModule {}
