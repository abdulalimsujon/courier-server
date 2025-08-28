import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TokenService } from './token.service';
import { ApiTags } from '@nestjs/swagger';
import { CreateTokenDto } from './dto/create-token.dto';
import { UpdateTokenDto } from './dto/update-token.dto';

@ApiTags('Token')
@Controller('token')
export class TokenController {
  constructor(private readonly tokenService: TokenService) {}

  @Post()
  async create(@Body() createTokenDto: CreateTokenDto) {
    const token = await this.tokenService.create(createTokenDto);
    return {
      success: true,
      message: 'Token created successfully',
      data: token,
    };
  }

  @Get()
  async findAll() {
    const tokens = await this.tokenService.findAll();
    return {
      success: true,
      message: 'Tokens fetched successfully',
      data: tokens,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const token = await this.tokenService.findOne(+id);
    return {
      success: true,
      message: 'Token fetched successfully',
      data: token,
    };
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateTokenDto: UpdateTokenDto,
  ) {
    const token = await this.tokenService.update(+id, updateTokenDto);
    return {
      success: true,
      message: 'Token updated successfully',
      data: token,
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.tokenService.remove(+id);
    return {
      success: true,
      message: 'Token removed successfully',
      data: null,
    };
  }
}
