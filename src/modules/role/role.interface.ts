export interface CreateRoleData {
  name: string;
  companyId: string;
  departmentId: string;
}

export interface UpdateRoleData extends CreateRoleData {
  roleId?: string;
}
