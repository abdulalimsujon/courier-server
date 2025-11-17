import { Type } from "class-transformer";
import { IsInt, IsOptional, Min } from "class-validator";

export class PaginationQueryDto {
    @IsOptional()
    @Type(()=>Number)
    @IsInt({message:"page must a integer"})
    @Min(1,{message:"page nust be at least 1"})
    page?: number = 1;


    @IsOptional()
    @Type(()=>Number)
    @IsInt({message:"page must a integer"})
    @Min(1,{message:"page nust be at least 1"})
    limit?: number = 10;
}