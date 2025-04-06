import { Field, Int, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class RegisterResponse {
  @Field()
  success: boolean;

  @Field(() => Int)
  id: number;

  @Field()
  email: string;
}