import { Request } from "express";

export interface RequestWithUser extends Request {
  companyCode: any;
  user?: {
    _id?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    employId?: string;
    phoneNumber?: number;
    adhar?: string;
    panCard?: string;
    status?: string;
    roleId?: string;
    departmentId?: string;
    profileImage?: string;
    strideScore?: string;
    additionalScore?: string;
    strideId?: number;
    companyId?: string;
    isDeleted?: boolean;
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
