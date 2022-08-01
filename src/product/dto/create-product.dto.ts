import { IsString } from "class-validator";


export class CreateProductDto {

    @IsString()
    name: string;

    @IsString()
    description: string;

    @IsString()
    price: number;

    @IsString()
    image: string;

    @IsString()
    category: string;

}
