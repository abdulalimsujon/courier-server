import { Global, Module } from '@nestjs/common';
import { databaseService } from './database.service';

@Global()
@Module({
  providers: [databaseService],
  exports: [databaseService],
})
export class DatabaseModule {}
