import { PartialType } from '@nestjs/swagger';
import { CreateParcelDto } from './create-percel.dto';

export class UpdatePercelDto extends PartialType(CreateParcelDto) {}
