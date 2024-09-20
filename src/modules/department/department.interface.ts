export interface CreateDepartmentData {
  name: string;
  companyId: string;
}

export interface UpdateDepartmentData extends CreateDepartmentData {
  departmentId?: string;
}
