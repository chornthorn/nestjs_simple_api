import { IsBoolean, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateTaskDto {

    @IsString()
    title: string;

    @IsString()
    @IsOptional()
    description: string;

    @IsBoolean()
    @IsOptional()
    is_completed: boolean;

    @IsNumber()
    @IsOptional()
    user_id: number;
}
