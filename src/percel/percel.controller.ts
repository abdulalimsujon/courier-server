import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PercelService } from './percel.service';
import { UpdatePercelDto } from './dto/update-percel.dto';
import { CreateParcelDto } from './dto/create-percel.dto';

@Controller('percel')
export class PercelController {
  constructor(private readonly percelService: PercelService) {}

  @Post()
  create(@Body() createPercelDto: CreateParcelDto) {
    return this.percelService.create(createPercelDto);
  }

  @Get()
  findAll() {
    return this.percelService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.percelService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePercelDto: UpdatePercelDto) {
    return this.percelService.update(+id, updatePercelDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.percelService.remove(+id);
  }
}
