import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { appConfig } from "../config/appConfig.js";
import {
  RequestWithCompany,
  RequestWithUser,
} from "../interface/app.interface.js";
// import User from "../modules/user/user.model.js";
// import { UserStatus } from "../modules/user/user.enum.js";
// import { errorMessages } from "../constants/messages.js";
import { ObjectId } from "../constants/type.js";
import SuperAdmin from "../modules/superAdmin/superAdmin.model.js";
import Company from "../modules/company/company.model.js";
import { getUserCollection } from "../modules/user/user.model.js";

export const protect = async (): Promise<any> => {
  return async (req: RequestWithUser, res: Response, next: NextFunction) => {
    let token: any;

    if (req.headers.authorization?.startsWith("Bearer") === true) {
      try {
        token = req.headers.authorization.split(" ")[1];
        let decoded: any = {};

        decoded = jwt.verify(token, appConfig.jwtSecret);

        if (decoded) {
          next();
        } else {
          res.status(401).send({ message: "Unauthorized" });
        }
      } catch (error) {
        console.error(error);
        res.status(401).send({ message: "Unauthorized" });
      }
    }
    if (!token) {
      res.status(401).send({ message: "Unauthorized, No token" });
    }
  };
};
export const userProtect = async (): Promise<any> => {
  return async (req: RequestWithUser, res: Response, next: NextFunction) => {
    let token: any;

    if (
      req?.headers?.authorization?.startsWith("Bearer") === true &&
      req.headers.authorization.split(" ")[1]
    ) {
      console.log(req.headers.authorization.split(" ")[1], "calling.....");

      try {
        token = req.headers.authorization.split(" ")[1];
        let decoded: any = {};

        decoded = jwt.verify(token, appConfig.jwtSecret);

        if (decoded) {
          const User = await getUserCollection(decoded?.companyId);
          const user: any = await User.findOne({
            _id: new ObjectId(decoded?.id),
            isDeleted: false,
          }).select("-password");
          if (user === null) {
            res.status(401).send({ message: "Unauthorized" });
          } else {
            req.user = user;
            req.companyCode = decoded?.companyId;
            next();
          }
        } else {
          res.status(401).send({ message: "Unauthorized" });
        }
      } catch (error) {
        console.error(error);
        res.status(401).send({ message: "Unauthorized" });
      }
    }
    if (!token) {
      res.status(401).send({ message: "Unauthorized, No token" });
    }
  };
};

export const superAdminProtect = async (): Promise<any> => {
  return async (req: RequestWithUser, res: Response, next: NextFunction) => {
    let token: any;

    if (req.headers.authorization?.startsWith("Bearer") === true) {
      try {
        token = req.headers.authorization.split(" ")[1];
        let decoded: any = {};

        decoded = jwt.verify(token, appConfig.jwtSecret);

        if (decoded) {
          const user: any = await SuperAdmin.findOne({
            _id: new ObjectId(decoded?.id),
            isDeleted: false,
          }).select("-password");

          if (user === null) {
            res.status(401).send({ message: "Unauthorized" });
          } else {
            req.user = user;
            next();
          }
        } else {
          res.status(401).send({ message: "Unauthorized" });
        }
      } catch (error) {
        console.error(error);
        res.status(401).send({ message: "Unauthorized" });
      }
    }
    if (!token) {
      res.status(401).send({ message: "Unauthorized, No token" });
    }
  };
};

export const companyProtect = async (): Promise<any> => {
  return async (req: RequestWithCompany, res: Response, next: NextFunction) => {
    let token: any;

    if (req.headers.authorization?.startsWith("Bearer") === true) {
      try {
        token = req.headers.authorization.split(" ")[1];
        let decoded: any = {};

        decoded = jwt.verify(token, appConfig.jwtSecret);
        console.log(decoded, "decoded");

        if (decoded) {
          const company: any = await Company.findOne({
            _id: new ObjectId(decoded?.id),
            isDeleted: false,
          }).select("-password -images");
          console.log(company, "company");

          if (company === null) {
            res.status(401).send({ message: "Unauthorized" });
          } else {
            req.company = company;
            next();
          }
        } else {
          res.status(401).send({ message: "Unauthorized" });
        }
      } catch (error) {
        console.error(error);
        res.status(401).send({ message: "Unauthorized" });
      }
    }
    if (!token) {
      res.status(401).send({ message: "Unauthorized, No token" });
    }
  };
};
// export const adminCompanyProtect = async (): Promise<any> => {
//   return async (req: RequestWithCompany, res: Response, next: NextFunction) => {
//     let token: any

//     if (req.headers.authorization?.startsWith('Bearer') === true) {
//       try {
//         token = req.headers.authorization.split(' ')[1]
//         let decoded: any = {}

//         decoded = jwt.verify(token, appConfig.jwtSecret)
//         console.log(decoded, 'decoded')

//         if (decoded) {
//           const user: any = await SuperAdmin.findOne({
//             _id: new ObjectId(decoded?.id),
//             isDeleted: false,
//           }).select('-password')
//           if (user === null) {
//             const company: any = await Company.findOne({
//               _id: new ObjectId(decoded?.id),
//               isDeleted: false,
//             }).select('-password -images')
//             console.log(company, 'company')
//             if (company === null) {
//               res.status(401).send({ message: 'Unauthorized' })
//             } else {
//               req.company = company
//               next()
//             }
//           } else {
//             req.company = user
//             next()
//           }
//         } else {
//           res.status(401).send({ message: 'Unauthorized' })
//         }
//       } catch (error) {
//         console.error(error)
//         res.status(401).send({ message: 'Unauthorized' })
//       }
//     }
//     if (!token) {
//       res.status(401).send({ message: 'Unauthorized, No token' })
//     }
//   }
// }

// export const authMiddleware = { protect, optionalProtect };
