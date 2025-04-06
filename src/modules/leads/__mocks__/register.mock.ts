import { RegisterInput } from "../dto/register.input";
import { Services } from "../models/services.enum";

export const mockRegisterInput: RegisterInput = {
  name: 'John Doe',
  email: 'johndoe@gmail.com',
  mobile: '9876',
  postcode: '7746',
  services: [Services.DELIVERY, Services.PAYMENT]
}