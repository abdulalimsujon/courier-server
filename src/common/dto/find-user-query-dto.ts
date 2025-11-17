import { IsOptional, IsString, MaxLength } from "class-validator";
import { PaginationQueryDto } from "./pagination-query-dto";



export class FindUserQueryDto extends PaginationQueryDto {

    @IsOptional()
    @IsString({message: "user name must be string"})
    @MaxLength(100,{message:"user name cannot exceed 100 characters"})
     username?: string
    


}