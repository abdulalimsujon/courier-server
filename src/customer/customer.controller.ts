import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  // UseGuards,
} from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
// import { RoleGuard } from 'src/guard/role.guard';
// import { UserRole } from '@prisma/client';
// import { JwtAuthGuard } from 'src/guard/jwt-auth.guard';
// import { Roles } from 'src/decorator/roles.decorator';
import { ApiSecurity } from '@nestjs/swagger';

@Controller('customer')
@ApiSecurity('JWT-auth')
// @UseGuards(JwtAuthGuard, RoleGuard)
// @Roles(UserRole.MERCHANT)
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Post('create')
  async create(@Body() createCustomerDto: CreateCustomerDto) {
    const customer = await this.customerService.create(createCustomerDto);
    return {
      success: true,
      message: 'Customer created successfully',
      data: customer,
    };
  }

  @Get()
  async findAll() {
    const customers = await this.customerService.findAll();
    return {
      success: true,
      message: 'Customers retrieved successfully',
      data: customers,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const customer = await this.customerService.findOne(+id);
    return {
      success: true,
      message: 'Customer retrieved successfully',
      data: customer,
    };
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ) {
    const customer = await this.customerService.update(+id, updateCustomerDto);
    return {
      success: true,
      message: 'Customer updated successfully',
      data: customer,
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.customerService.remove(+id);
    return {
      success: true,
      message: 'Customer deleted successfully',
    };
  }
}
