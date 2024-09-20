import { FilterQuery, QueryOptions } from "mongoose";

export interface CreateDepartmentData {
  name: string;
  companyId: string;
}

export interface UpdateDepartmentData extends CreateDepartmentData {
  departmentId?: string;
}

export interface GetAllDepartmentData {
  query: FilterQuery<any>;
  options: QueryOptions;
  companyId: string;
}
