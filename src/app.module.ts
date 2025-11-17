import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './main/user/user.module';
import { AuthModule } from './main/auth/auth.module';
import { PassportLocalStrategy } from './strategy/local.strategy';
import { CustomerModule } from './customer/customer.module';
import { PercelModule } from './percel/percel.module';
import { TokenModule } from './token/token.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { ConfigModule } from '@nestjs/config';
import { FileUploadModule } from './file-upload/file-upload.module';
import { EventsModule } from './events/events.module';

@Module({
  imports: [
    DatabaseModule,
    UserModule,
    AuthModule,
    CustomerModule,
    PercelModule,
    TokenModule,

    ConfigModule.forRoot({
          isGlobal: true
    }),

    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60000,
          limit: 10,
        },
      ],
    }),

    FileUploadModule,

    EventsModule,
  
  ],
  controllers: [AppController],
  providers: [AppService, PassportLocalStrategy],
})
export class AppModule {}
