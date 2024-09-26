import { FilterQuery, QueryOptions } from "mongoose";
import WorkHistory from "./workHistory.model.js";

export interface WorkHistoryData {
  strideId: string;
  companyId: string;
  startDate: Date;
  endDate?: Date;
}

export interface GetAllWorkHistoriesData {
  query: FilterQuery<typeof WorkHistory>;
  options?: QueryOptions;
}

export interface UpdateHistoryData {
  strideId?: string;
  companyId?: string;
  startDate?: Date;
  endDate?: Date;
}
