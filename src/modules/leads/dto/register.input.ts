import { Field, InputType } from "@nestjs/graphql";
import { Services } from "../models/services.enum";
import { ArrayMinSize, ArrayNotEmpty, IsEmail, IsEnum, IsNotEmpty } from "class-validator";

@InputType()
export class RegisterInput {
  @Field()
  @IsNotEmpty({ message: "Name is required" })
  name: string;

  @Field()
  @IsNotEmpty({ message: "Email is required" })
  @IsEmail({}, { message: "Email must be a valid email address" })
  email: string;

  @Field()
  @IsNotEmpty({ message: "Mobile number is required" })
  mobile: string;

  @Field()
  @IsNotEmpty({ message: "Postcode is required" })
  postcode: string;

  @Field(() => [Services])
  @ArrayNotEmpty({ message: "At least one service must be selected" })
  @ArrayMinSize(1, { message: "At least one service must be selected" })
  @IsEnum(Services, { 
    each: true, 
    message: "Each service must be a valid service type" 
  })
  services: Services[];
}