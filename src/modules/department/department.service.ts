import { generateAPIError } from "../../errors/apiError.js";
import {
  CreateDepartmentData,
  GetAllDepartmentData,
  UpdateDepartmentData,
} from "./department.interface.js";
import { errorMessages, successMessages } from "../../constants/messages.js";
import { getDepartmentCollection } from "./department.model.js";
import { ObjectId } from "../../constants/type.js";

const createDepartment = async ({
  name,
  companyId,
  companyObjectId,
}: CreateDepartmentData): Promise<any> => {
  const Department = await getDepartmentCollection(companyId);

  const department = await Department.findOne({
    name,
    isDeleted: false,
  });

  if (department != null) {
    return await generateAPIError(errorMessages.departmentExists, 400);
  }

  return await Department.create({
    name,
    companyId: companyObjectId,
  });
};

const getAllDepartments = async ({
  query = {},
  options,
  companyId,
}: GetAllDepartmentData): Promise<any> => {
  const Department = await getDepartmentCollection(companyId);

  const [data, totalCount] = await Promise.all([
    await Department.find(query, {}, options),
    await Department.countDocuments(query),
  ]);

  return { data, totalCount };
};

const getDepartmentById = async (
  companyId: string,
  departmentId: string,
): Promise<any> => {
  const Department = await getDepartmentCollection(companyId);
  const data = await Department.findOne({
    _id: new ObjectId(departmentId),
    isDeleted: false,
  });

  if (data === null) {
    return await generateAPIError(errorMessages.departmentNotFound, 400);
  }

  return data;
};

const updateDepartment = async ({
  companyId,
  departmentId,
  name,
}: UpdateDepartmentData): Promise<any> => {
  const Department = await getDepartmentCollection(companyId);
  const data = await Department.findOne({
    _id: new ObjectId(departmentId),
    isDeleted: false,
  });

  if (data === null) {
    return await generateAPIError(errorMessages.departmentNotFound, 400);
  }

  return await Department.findOneAndUpdate(
    {
      _id: new ObjectId(departmentId),
      isDeleted: false,
    },
    {
      ...(name !== null && {
        name,
      }),
    },
    {
      new: true,
    },
  );
};

const deleteDepartment = async (
  companyId: string,
  departmentId: string,
): Promise<any> => {
  const Department = await getDepartmentCollection(companyId);
  const data = await Department.findOne({
    _id: new ObjectId(departmentId),
    isDeleted: false,
  });

  if (data === null) {
    return await generateAPIError(errorMessages.departmentNotFound, 400);
  }

  await Department.findOneAndUpdate(
    {
      _id: new ObjectId(departmentId),
      isDeleted: false,
    },
    {
      isDeleted: true,
    },
    {
      new: true,
    },
  );

  return {
    message: successMessages.departmentDeleted,
  };
};

export const departmentService = {
  createDepartment,
  getAllDepartments,
  getDepartmentById,
  updateDepartment,
  deleteDepartment,
};
