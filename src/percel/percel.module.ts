import { Module } from '@nestjs/common';
import { PercelService } from './percel.service';
import { PercelController } from './percel.controller';

@Module({
  controllers: [PercelController],
  providers: [PercelService],
})
export class PercelModule {}
