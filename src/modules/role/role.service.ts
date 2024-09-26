import { generateAPIError } from "../../errors/apiError.js";
import { getRoleCollection } from "./role.model.js";
import { errorMessages, successMessages } from "../../constants/messages.js";
import { CreateRoleData, UpdateRoleData } from "./role.interface.js";
import { ObjectId } from "../../constants/type.js";

const createRole = async ({
  name,
  companyId,
  departmentId,
  companyObjectId,
}: CreateRoleData): Promise<any> => {
  const Role = await getRoleCollection(companyId);

  const data = await Role.findOne({
    name,
    isDeleted: false,
  });

  if (data !== null) {
    return await generateAPIError(errorMessages.roleExists, 400);
  }

  return await Role.create({
    name,
    companyId: companyObjectId,
    departmentId,
    departmentCollection: `rols${companyId}`,
  });
};

const getAllRoles = async ({
  query = {},
  options,
  companyId,
}: any): Promise<any> => {
  const Role = await getRoleCollection(companyId);
  const [data, totalCount] = await Promise.all([
    await Role.find(query, {}, options),
    await Role.countDocuments(query),
  ]);

  return { data, totalCount };
};

const getRoleById = async (companyId: string, roleId: string): Promise<any> => {
  const Role = await getRoleCollection(companyId);
  const data = await Role.findOne({
    _id: new ObjectId(roleId),
    isDeleted: false,
  });

  if (data === null) {
    return await generateAPIError(errorMessages.roleNotFound, 400);
  }

  return data;
};

const updateRole = async ({
  companyId,
  roleId,
  name,
}: UpdateRoleData): Promise<any> => {
  const Role = await getRoleCollection(companyId);

  const data = await Role.findOne({
    _id: new ObjectId(roleId),
    isDeleted: false,
  });

  if (data === null) {
    return await generateAPIError(errorMessages.roleNotFound, 400);
  }

  return await Role.findOneAndUpdate(
    {
      _id: new ObjectId(roleId),
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

const deleteRole = async (companyId: string, roleId: string): Promise<any> => {
  const Role = await getRoleCollection(companyId);

  const data = await Role.findOne({
    _id: new ObjectId(roleId),
    isDeleted: false,
  });

  if (data === null) {
    return await generateAPIError(errorMessages.roleNotFound, 400);
  }

  await Role.findOneAndUpdate(
    {
      _id: new ObjectId(roleId),
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
    message: successMessages.roleDeleted,
  };
};

export const roleService = {
  createRole,
  getAllRoles,
  getRoleById,
  updateRole,
  deleteRole,
};
