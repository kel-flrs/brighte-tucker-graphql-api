import { Field, Int, ObjectType } from "@nestjs/graphql";
import { Services } from "./services.enum";

@ObjectType()
export class Lead {
  @Field(() => Int)
  id: number;

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