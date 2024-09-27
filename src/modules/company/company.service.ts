import bcrypt from "bcryptjs";
import { generateToken, hashValue } from "../../utils/auth.utils.js";
import { errorMessages, successMessages } from "../../constants/messages.js";
import { generateAPIError } from "../../errors/apiError.js";
import { CompanyData, CompanyLoginData } from "./company.interface.js";
import Company from "./company.model.js";
import { createCompanyId } from "./company.utils.js";
import { ObjectId } from "../../constants/type.js";

const createCompany = async ({
  name,
  email,
  password,
  address,
  location,
  industry,
  theme,
  logo,
  coverImage,
  images,
  phoneNumber,
}: CompanyData | any): Promise<CompanyData | any> => {
  const companyExist = await Company.findOne({
    isDeleted: false,
    $or: [
      {
        email,
      },
      {
        phoneNumber,
      },
    ],
  });

  if (companyExist != null) {
    return await generateAPIError(
      companyExist?.email === email
        ? errorMessages?.companyEmailExists
        : errorMessages?.companyPhoneNumberExists,
      400,
    );
  }

  const companyId = await createCompanyId();

  const hashedPassword = await hashValue(password, 10);
  const company = await Company.create({
    name,
    email,
    password: hashedPassword,
    ...(address !== null && {
      address,
    }),
    ...(location !== null && {
      location: {
        type: "Point",
        coordinates: [location?.lon, location?.lat],
      },
    }),
    ...(industry !== null && {
      industry,
    }),
    ...(theme !== null && {
      theme,
    }),
    ...(logo !== null && {
      logo,
    }),
    ...(coverImage !== null && {
      coverImage,
    }),
    ...(phoneNumber !== null && {
      phoneNumber,
    }),
    ...(images !== null && {
      images,
    }),
    companyId,
  });

  return company;
};

const companyLogin = async ({
  email,
  password,
}: CompanyLoginData): Promise<any> => {
  const company = await Company.findOne({
    email,
    isDeleted: false,
  }).populate("industry");
  if (company === null) {
    return await generateAPIError(errorMessages.inValidEmail, 400);
  }

  if (!company?.status) {
    return await generateAPIError(errorMessages.userAccountBlocked, 400);
  }

  const comparePassword = await bcrypt.compare(
    password,
    company?.password ?? "",
  );

  if (!comparePassword) {
    return await generateAPIError(errorMessages.invalidPassword, 400);
  }

  return {
    name: company?.name,
    email: company?.email,
    address: company?.address,
    location: company?.location,
    industry: company?.industry,
    theme: company?.theme,
    logo: company?.logo,
    coverImage: company?.coverImage,
    phoneNumber: company?.phoneNumber,
    companyId: company?.companyId,
    images: company?.images,
    isDeleted: company?.isDeleted,
    createdAt: company?.createdAt,
    updatedAt: company?.updatedAt,
    token: await generateToken({
      id: String(company?._id),
      companyId: company?.companyId,
    }),
  };
};

const getAllCompanies = async ({ query = {}, options }: any): Promise<any> => {
  const [data, totalCount] = await Promise.all([
    await Company.find(query, {}, options)
      .populate("industry")
      .select("-password"),
    await Company.countDocuments(query),
  ]);

  return { data, totalCount };
};

const getCompanyById = async (industryId: string): Promise<any> => {
  return await Company.findOne({
    _id: new ObjectId(industryId),
    isDeleted: false,
  })
    .populate("industry")
    .select("-password");
};

const updateCompany = async (
  companyId: string,
  {
    name,
    email,
    password,
    oldPassword,
    address,
    location,
    industry,
    theme,
    logo,
    coverImage,
    phoneNumber,
    images,
  }: any,
): Promise<any> => {
  const company = await Company.findOne({
    _id: new ObjectId(companyId),
    isDeleted: false,
  });

  let hashedPassword;

  if (company === null) {
    return await generateAPIError(errorMessages.companyNotFound, 400);
  }

  if (password && oldPassword) {
    const comparePassword = await bcrypt.compare(
      oldPassword,
      company?.password ?? "",
    );
    if (!comparePassword) {
      return await generateAPIError(errorMessages.invalidOldPassword, 400);
    }
  }

  if (password && oldPassword) {
    hashedPassword = await hashValue(password ?? "", 10);
    console.log(hashedPassword, "hashword");
  }
  console.log(name, "name-name", password, "password", oldPassword);

  return await Company.findOneAndUpdate(
    {
      _id: new ObjectId(companyId),
      isDeleted: false,
    },
    {
      ...(name && {
        name,
      }),
      ...(email && {
        email: email.toLowerCase(),
      }),
      ...(password &&
        oldPassword && {
          password: hashedPassword,
        }),
      ...(address && {
        address,
      }),
      ...(location && {
        location: {
          coordinates: [location?.lon, location?.lat],
        },
      }),
      ...(industry && {
        industry,
      }),
      ...(theme && {
        theme,
      }),
      ...(logo && {
        logo,
      }),
      ...(coverImage && {
        coverImage,
      }),
      ...(phoneNumber && {
        phoneNumber,
      }),
      ...(images && {
        images,
      }),
    },
    {
      new: true,
    },
  );
};

const deleteCompany = async (companyId: string): Promise<any> => {
  const company = await Company.findOne({
    _id: new ObjectId(companyId),
    isDeleted: false,
  });

  if (company === null) {
    return await generateAPIError(errorMessages.companyNotFound, 400);
  }

  await Company.findOneAndUpdate(
    {
      _id: new ObjectId(companyId),
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

export const companyService = {
  createCompany,
  companyLogin,
  getAllCompanies,
  getCompanyById,
  updateCompany,
  deleteCompany,
};
