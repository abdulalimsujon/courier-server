import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTokenDto } from './dto/create-token.dto';
import { UpdateTokenDto } from './dto/update-token.dto';
import { databaseService } from 'src/database/database.service';

@Injectable()
export class TokenService {
  constructor(private readonly databaseService: databaseService) {}
  async create(createTokenDto: CreateTokenDto) {
    return await this.databaseService.token.create({
      data: {
        ...createTokenDto,
      },
    });
  }

  async findAll() {
    return this.databaseService.token.findMany();
  }

  async findOne(id: number) {
    const token = await this.databaseService.token.findUnique({
      where: { id },
    });
    if (!token) throw new NotFoundException(`Token with ID ${id} not found`);
    return token;
  }

  async update(id: number, updateTokenDto: UpdateTokenDto) {
    await this.findOne(id);
    return this.databaseService.token.update({
      where: { id },
      data: updateTokenDto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.databaseService.token.delete({ where: { id } });
  }
}
