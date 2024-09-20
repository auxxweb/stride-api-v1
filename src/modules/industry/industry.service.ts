import { generateAPIError } from "../../errors/apiError.js";
import { ObjectId } from "../../constants/type.js";
import { GetAllIndustriesData, IndustryData } from "./industry.interface.js";
import Industry from "./industry.model.js";
import { IndustryDocument } from "./industry.types.js";
import { errorMessages, successMessages } from "../../constants/messages.js";

const createIndustry = async ({ name, image }: any): Promise<any> => {
  const data = await Industry.findOne({
    name,
    isDeleted: false,
  });

  if (data !== null) {
    return await generateAPIError(errorMessages.industryExists, 400);
  }
  return await Industry.create({
    name,
    image,
  });
};

const getAllIndustries = async ({
  query = {},
  options,
}: GetAllIndustriesData): Promise<{
  data: IndustryDocument[] | any;
  totalCount: number;
}> => {
  const [data, totalCount] = await Promise.all([
    Industry.find(query, {}, options),
    Industry.countDocuments(query),
  ]);

  console.log(data, totalCount, "skdhfklshf", query);

  return { data, totalCount };
};

const getIndustryById = async (
  id: string,
): Promise<IndustryDocument | null> => {
  const data = await Industry.findOne({
    _id: new ObjectId(id),
    isDeleted: false,
  });

  if (data === null) {
    return await generateAPIError(errorMessages.industryNotFount, 400);
  }

  return data;
};

const updateIndustry = async (
  id: string,
  updateData: Partial<IndustryData>,
): Promise<IndustryData | null> => {
  const data = await Industry.findOne({
    _id: new ObjectId(id),
    isDeleted: false,
  });

  if (data === null) {
    return await generateAPIError(errorMessages.industryNotFount, 400);
  }

  return await Industry.findOneAndUpdate(
    {
      _id: new ObjectId(id),
      isDeleted: false,
    },
    {
      ...(updateData?.image != null && {
        image: updateData?.image,
      }),
      ...(updateData?.name != null && {
        name: updateData?.name,
      }),
    },
    {
      new: true,
    },
  );
};

const deleteIndustry = async (id: string): Promise<any> => {
  const data = await Industry.findOne({
    _id: new ObjectId(id),
    isDeleted: false,
  });

  if (data === null) {
    return await generateAPIError(errorMessages.industryNotFount, 400);
  }

  await Industry.findOneAndUpdate(
    {
      _id: new ObjectId(id),
      isDeleted: false,
    },
    {
      isDeleted: true,
    },
  );

  return {
    message: successMessages.industryDeleted,
  };
};

export const industryService = {
  createIndustry,
  getAllIndustries,
  getIndustryById,
  updateIndustry,
  deleteIndustry,
};
