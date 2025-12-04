import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import configuration from './config/configuration';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { typeOrmConfigFactory } from './config/typeorm.config';
import { AuthModule } from './modules/auth/auth.module';
import { FileModule } from './services/file/file.module';
import { SeederModule } from './seeder/seeder.module';
import { TransactionModule } from './common/transaction/transaction.module';
import { WinstonModule } from 'nest-winston';
import { winstonConfig } from './config/winston.config';
import { UserModule } from './modules/user/user.module';
import { MeetingModule } from './modules/meeting/meeting.module';
import { BoardModule } from './modules/board/board.module';
import { OpenaiModule } from './services/openai/openai.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration]
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: typeOrmConfigFactory,
      inject: [ConfigService]
    }),
    WinstonModule.forRoot(winstonConfig), 
    SeederModule,
    TransactionModule,
    AuthModule,
    FileModule,
    UserModule,
    MeetingModule,
    BoardModule,
    OpenaiModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
