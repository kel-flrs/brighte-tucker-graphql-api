import { registerEnumType } from "@nestjs/graphql";

export enum Services {
  DELIVERY = 'delivery',
  PICKUP = 'pick-up',
  PAYMENT = 'payment'
}

registerEnumType(Services, {
  name: 'Services',
  description: 'Services that Brighte Eats offers'
});