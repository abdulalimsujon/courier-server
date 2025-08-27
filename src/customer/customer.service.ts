import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { databaseService } from 'src/database/database.service';

@Injectable()
export class CustomerService {
  constructor(private readonly databaseService: databaseService) {}

  async create(createCustomerDto: CreateCustomerDto) {
    return this.databaseService.customer.create({
      data: createCustomerDto,
    });
  }

  async findAll() {
    return this.databaseService.customer.findMany({
      include: {
        parcel: true,
      },
    });
  }

  async findOne(id: number) {
    const customer = await this.databaseService.customer.findUnique({
      where: { id },
      include: {
        parcel: true,
      },
    });

    if (!customer) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }
    return customer;
  }

  async update(id: number, updateCustomerDto: UpdateCustomerDto) {
    await this.findOne(id);

    return this.databaseService.customer.update({
      where: { id },
      data: updateCustomerDto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.databaseService.customer.delete({
      where: { id },
    });
  }
}
