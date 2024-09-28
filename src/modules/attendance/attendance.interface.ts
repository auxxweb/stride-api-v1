interface BreakData {
  breakIn?: Date;
  breakOut?: Date;
}
interface LoginLogoutData {
  location: any;
  time: Date;
}

export interface MarkAttendanceData {
  userId: string;
  date: Date;
  login: LoginLogoutData;
  logOut: LoginLogoutData;
  breakData?: BreakData;
  additionalDetails: string;
  companyId: string;
}
