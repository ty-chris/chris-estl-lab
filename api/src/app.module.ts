import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Constants } from './config';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    UserModule,
    MikroOrmModule.forRoot({
      entities: ['./dist/entities'],
      entitiesTs: ['./src/entities'],
      dbName: Constants.DbName,
      type: 'mongo',
      clientUrl: Constants.DbConnectionString,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
