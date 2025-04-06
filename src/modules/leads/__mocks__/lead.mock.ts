import { Lead } from "@prisma/client";
import { Services } from "../models/services.enum";

export const mockLeads: Lead[] = [
  { 
    id: 1,
    name: 'James Wilson',
    email: 'james.wilson@gmail.com',
    mobile: '0412 345 678',
    postcode: '2060',
    services: [Services.DELIVERY, Services.PAYMENT]
  },
  {
    id: 2,
    name: 'Sophie Taylor',
    email: 'sophie.taylor@outlook.com',
    mobile: '0423 789 456',
    postcode: '3143',
    services: [Services.PICKUP, Services.PAYMENT]
  },
  {
    id: 3,
    name: 'Liam Nguyen',
    email: 'liam.nguyen@hotmail.com',
    mobile: '0437 654 321',
    postcode: '4000',
    services: [Services.DELIVERY, Services.PICKUP, Services.PAYMENT]
  }
];

export const mockLead: Lead = {
  id: 2,
  name: 'Sophie Taylor',
  email: 'sophie.taylor@outlook.com',
  mobile: '0423 789 456',
  postcode: '3143',
  services: [Services.PICKUP, Services.PAYMENT]
}