import { Field, InputType } from "@nestjs/graphql";
import { Services } from "../models/services.enum";

@InputType()
export class RegisterInput {
  @Field()
  name: string;

  @Field()
  email: string;

  @Field()
  mobile: string;

  @Field()
  postcode: string;

  @Field(() => [Services])
  services: Services[];
}