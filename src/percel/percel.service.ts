import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdatePercelDto } from './dto/update-percel.dto';
import { databaseService } from 'src/database/database.service';
import { CreateParcelDto } from './dto/create-percel.dto';

@Injectable()
export class PercelService {
  constructor(private readonly databaseService: databaseService) {}

  async create(createPercelDto: CreateParcelDto) {
    return this.databaseService.parcel.create({
      data: createPercelDto,
    });
  }

  async findAll() {
    return this.databaseService.parcel.findMany();
  }

  async findOne(id: number) {
    const parcel = await this.databaseService.parcel.findUnique({
      where: { id },
    });

    if (!parcel) {
      throw new NotFoundException(`Parcel with ID ${id} not found`);
    }

    return parcel;
  }

  async update(id: number, updatePercelDto: UpdatePercelDto) {
    const parcel = await this.databaseService.parcel.findUnique({
      where: { id },
    });

    if (!parcel) {
      throw new NotFoundException(`Parcel with ID ${id} not found`);
    }

    return this.databaseService.parcel.update({
      where: { id },
      data: updatePercelDto,
    });
  }

  async remove(id: number) {
    const parcel = await this.databaseService.parcel.findUnique({
      where: { id },
    });

    if (!parcel) {
      throw new NotFoundException(`Parcel with ID ${id} not found`);
    }

    return this.databaseService.parcel.delete({
      where: { id },
    });
  }
}
