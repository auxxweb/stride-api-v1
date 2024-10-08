export interface CreateUser {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  adhar?: {
    number: number;
    images: string[];
  };
  panCard?: {
    number: string;
    images: string[];
  };
  profileImage?: string;
  departmentId: string;
  roleId: string;
  additionalDetails: string;
  companyId: string;
  countryCode: string;
  gender: string;
  address: string;
  emergencyNumber: number;
}

export interface UserLoginData {
  userId: string;
  password: string;
}

export interface StrideExistData {
  email: string;
  phoneNumber: number;
}
