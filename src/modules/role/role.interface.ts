export interface CreateRoleData {
  name: string;
  companyId: string;
  departmentId: string;
  companyObjectId: string;
}

export interface UpdateRoleData extends CreateRoleData {
  roleId?: string;
}
