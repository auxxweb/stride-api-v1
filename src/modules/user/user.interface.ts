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
}

export interface UserLoginData {
  userId: string;
  password: string;
}
