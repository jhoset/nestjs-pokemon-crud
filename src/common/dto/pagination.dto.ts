import { IsNumber, IsOptional, IsPositive, Min, minLength } from "class-validator";


export class PaginationDto {
    @IsOptional()
    @IsPositive()
    @IsNumber()
    @Min(1)
    limit?: number;

    @IsOptional()
    @Min(0)
    @IsNumber()
    offset?: number;

}