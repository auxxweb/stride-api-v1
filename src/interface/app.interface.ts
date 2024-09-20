import { Request } from "express";

export interface RequestWithUser extends Request {
  user?: {
    _id?: string;
    name?: string;
    email?: string;
    password?: string;
    country?: string;
    industry?: string;
    position?: string;
    org?: string;
    status?: string;
    role?: string;
  };
}

export interface RequestWithCompany extends Request {
  company?: {
    _id?: string;
    email?: string;
    password?: string;
    status?: string;
    logo?: string;
    phoneNumber?: string;
    companyId?: string;
  };
}

export interface sendMailData {
  to: string;
  text: string;
  subject: string;
}

export interface LocationData {
  lat: number;
  lon: number;
}
