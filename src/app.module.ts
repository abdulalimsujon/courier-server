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

@Module({
  imports: [
    DatabaseModule,
    UserModule,
    AuthModule,
    CustomerModule,
    PercelModule,
    TokenModule,
  ],
  controllers: [AppController],
  providers: [AppService, PassportLocalStrategy],
})
export class AppModule {}
