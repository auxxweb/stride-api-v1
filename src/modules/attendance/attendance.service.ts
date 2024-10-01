/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
import { ObjectId } from "../../constants/type.js";
import { MarkAttendanceData } from "./attendance.interface.js";
import { getAttendanceCollection } from "./attendance.model.js";
import { generateAPIError } from "../../errors/apiError.js";
import { errorMessages } from "../../constants/messages.js";
import { getUserCollection } from "../../modules/user/user.model.js";

const markAttendance = async ({
  userId,
  date,
  login,
  logOut,
  breakData,
  additionalDetails,
  companyId,
}: MarkAttendanceData): Promise<any> => {
  const Attendance = await getAttendanceCollection(companyId);
  const UserModel = await getUserCollection(companyId);

  // Ensure 'date' is a valid Date object
  const actualDate =
    date !== null || date !== undefined ? new Date(date) : new Date();

  const startOfDay = new Date(actualDate.setHours(0, 0, 0, 0));
  const endOfDay = new Date(actualDate.setHours(23, 59, 59, 999));

  const attendanceExist = await Attendance.findOne({
    userId: new ObjectId(userId),
    date: {
      $gte: startOfDay,
      $lt: endOfDay,
    },
    isDeleted: false,
  });

  // **New Validation**: Prevent duplicate login for the same day
  if (attendanceExist && login) {
    return await generateAPIError("User is already logged in for the day", 400);
  }

  // **Prevent logOut if attendance does not exist for the day**
  if (logOut && attendanceExist === null) {
    return await generateAPIError(errorMessages.attendanceNotExists, 400);
  }

  if (attendanceExist !== null) {
    const updatedBreakData = attendanceExist.breakData || [];

    // **Rule 1**: Prevent taking/updating breaks if the user has already logged out
    if (
      attendanceExist.logOut?.location?.coordinates?.length &&
      (breakData?.breakIn || breakData?.breakOut)
    ) {
      return await generateAPIError(
        "Can't take or update break after logout",
        400,
      );
    }

    // **Rule 2**: Prevent taking a new break if the last break doesn't have a breakOut
    const lastBreak = updatedBreakData[updatedBreakData.length - 1];
    if (lastBreak && !lastBreak.breakOut && breakData?.breakIn) {
      return await generateAPIError(
        "Can't take a new break without ending the previous one",
        400,
      );
    } else if (
      lastBreak?.breakOut &&
      breakData?.breakOut &&
      !breakData?.breakIn
    ) {
      return await generateAPIError(
        "Can't update breakOut time withOut taking a break",
        400,
      );
    }

    // **Rule 3**: Prevent logging out if an active break exists (without breakOut)
    if (logOut) {
      if (lastBreak && !lastBreak.breakOut) {
        return await generateAPIError(
          "Can't log out with an active break",
          400,
        );
      }

      // Ensure logOut time is greater than login time
      if (logOut.time && logOut.time <= attendanceExist.login.time) {
        return await generateAPIError(
          "logOut time must be greater than login time",
          400,
        );
      }

      // Ensure valid logOut coordinates before updating
      if (logOut?.location?.lon && logOut?.location?.lat) {
        // return await Attendance.findOneAndUpdate(
        //   {
        //     userId: new ObjectId(userId),
        //     date: {
        //       $gte: startOfDay,
        //       $lt: endOfDay,
        //     },
        //     isDeleted: false,
        //   },
        //   {
        //     logOut: {
        //       location: {
        //         type: "Point",
        //         coordinates: [logOut.location.lon, logOut.location.lat],
        //       },
        //       time: new Date(logOut.time) ?? new Date(),
        //     },
        //     ...(breakData && { breakData: updatedBreakData }),
        //     ...(additionalDetails && { additionalDetails }),
        //   },
        //   {
        //     new: true,
        //   },
        // );
        // Step 1: Perform the update
        const updatedAttendance = await Attendance.findOneAndUpdate(
          {
            userId: new ObjectId(userId),
            date: {
              $gte: startOfDay,
              $lt: endOfDay,
            },
            isDeleted: false,
          },
          {
            logOut: {
              location: {
                type: "Point",
                coordinates: [logOut.location.lon, logOut.location.lat],
              },
              time: new Date(logOut.time) ?? new Date(),
            },
            ...(breakData && { breakData: updatedBreakData }),
            ...(additionalDetails && { additionalDetails }),
          },
          {
            new: true, // return the updated document
          },
        );

        // Step 2: Compute loginKey based on login and logOut times
        const loginKey =
          updatedAttendance.login?.time && !updatedAttendance.logOut?.time
            ? "loggedIn"
            : updatedAttendance.login?.time && updatedAttendance.logOut?.time
            ? "loggedOut"
            : null; // set default value if neither condition is met

        // Step 3: Compute breakStatus based on breakData
        let breakStatus = "NA"; // default value if breakData is empty
        if (updatedAttendance.breakData?.length > 0) {
          const lastBreak =
            updatedAttendance.breakData[updatedAttendance.breakData.length - 1];

          if (lastBreak.breakIn === null && lastBreak.breakOut === null) {
            breakStatus = "NA";
          } else if (
            lastBreak.breakIn !== null &&
            lastBreak.breakOut === null
          ) {
            breakStatus = "breakIn";
          } else {
            breakStatus = "breakOut";
          }
        }

        // Return the updated document with loginKey and breakStatus
        return {
          ...updatedAttendance.toObject(),
          loginKey,
          breakStatus,
        };
      } else {
        return await generateAPIError("Invalid logOut location", 400);
      }
    }

    // Handle break data (when no logOut)
    if (breakData?.breakIn || breakData?.breakOut) {
      // **New Condition**: Prevent breakOut if there is no corresponding breakIn
      if (breakData?.breakOut && !lastBreak?.breakIn) {
        return await generateAPIError(
          "Can't record breakOut without breakIn",
          400,
        );
      }

      // Validate that breakOut time is greater than breakIn time
      if (
        breakData?.breakOut &&
        lastBreak?.breakIn &&
        breakData.breakOut <= lastBreak.breakIn
      ) {
        return await generateAPIError(
          "breakOut time must be greater than breakIn time",
          400,
        );
      }

      // Update or add break data
      if (lastBreak && !lastBreak.breakOut) {
        updatedBreakData[updatedBreakData.length - 1].breakOut =
          breakData.breakOut;
      } else {
        updatedBreakData.push({
          breakIn: breakData.breakIn,
          breakOut: breakData.breakOut,
        });
      }

      const updatedAttendance = await Attendance.findOneAndUpdate(
        {
          userId: new ObjectId(userId),
          date: {
            $gte: startOfDay,
            $lt: endOfDay,
          },
          isDeleted: false,
        },
        {
          ...(breakData && { breakData: updatedBreakData }),
          ...(additionalDetails && { additionalDetails }),
        },
        {
          new: true,
        },
      );

      const loginKey =
        updatedAttendance.login?.time && !updatedAttendance.logOut?.time
          ? "loggedIn"
          : updatedAttendance.login?.time && updatedAttendance.logOut?.time
          ? "loggedOut"
          : null; // set default value if neither condition is met

      // Step 3: Compute breakStatus based on breakData
      let breakStatus = "NA"; // default value if breakData is empty
      if (updatedAttendance.breakData?.length > 0) {
        const lastBreak =
          updatedAttendance.breakData[updatedAttendance.breakData.length - 1];

        if (lastBreak.breakIn === null && lastBreak.breakOut === null) {
          breakStatus = "NA";
        } else if (lastBreak.breakIn !== null && lastBreak.breakOut === null) {
          breakStatus = "breakIn";
        } else {
          breakStatus = "breakOut";
        }
      }

      // Return the updated document with loginKey and breakStatus
      return {
        ...updatedAttendance.toObject(),
        loginKey,
        breakStatus,
      };
    }
  } else {
    // Ensure valid login coordinates when creating new attendance
    if (!login?.location?.lon || !login?.location?.lat) {
      return await generateAPIError("Invalid login location", 400);
    }

    // Creating a new attendance entry
    const newAttendance = {
      userCollection: UserModel.modelName,
      userId,
      date: new Date(date),
      login: {
        location: {
          type: "Point",
          coordinates: [login.location.lon, login.location.lat],
        },
        time: new Date(login.time) ?? new Date(),
      },
      companyId,
      ...(additionalDetails && { additionalDetails }),
    };

    const updatedAttendance = await Attendance.create(newAttendance);

    const loginKey =
      updatedAttendance.login?.time && !updatedAttendance.logOut?.time
        ? "loggedIn"
        : updatedAttendance.login?.time && updatedAttendance.logOut?.time
        ? "loggedOut"
        : null; // set default value if neither condition is met

    // Step 3: Compute breakStatus based on breakData
    let breakStatus = "NA"; // default value if breakData is empty
    if (updatedAttendance.breakData?.length > 0) {
      const lastBreak =
        updatedAttendance.breakData[updatedAttendance.breakData.length - 1];

      if (lastBreak.breakIn === null && lastBreak.breakOut === null) {
        breakStatus = "NA";
      } else if (lastBreak.breakIn !== null && lastBreak.breakOut === null) {
        breakStatus = "breakIn";
      } else {
        breakStatus = "breakOut";
      }
    }

    // Return the updated document with loginKey and breakStatus
    return {
      ...updatedAttendance.toObject(),
      loginKey,
      breakStatus,
    };
  }
  console.log("hello how are you");
};

const getUserAttendance = async ({
  companyId,
  userId,
  date,
}: {
  companyId: string;
  userId: string;
  date: Date;
}): Promise<any> => {
  // Ensure 'date' is a valid Date object
  const actualDate = new Date(date ?? new Date());

  const startOfDay = new Date(actualDate.setHours(0, 0, 0, 0));
  const endOfDay = new Date(actualDate.setHours(23, 59, 59, 999));
  const Attendance = await getAttendanceCollection(companyId);
  // const UserModel = await getUserCollection(companyId)

  const data = await Attendance.aggregate([
    {
      $match: {
        userId: new ObjectId(userId),
        date: {
          $gte: startOfDay,
          $lt: endOfDay,
        },
        isDeleted: false,
      },
    },
    {
      $project: {
        _id: 1,
        userId: 1,
        date: 1,
        login: 1,
        logOut: 1,
        breakData: 1,
        loginKey: {
          $cond: {
            if: {
              $and: [
                { $gt: ["$login.time", null] }, // login.time exists
                { $not: [{ $gt: ["$logOut.time", null] }] }, // logOut.time does not exist
              ],
            },
            then: "loggedIn",
            else: {
              $cond: {
                if: {
                  $and: [
                    { $gt: ["$login.time", null] }, // login.time exists
                    { $gt: ["$logOut.time", null] }, // logOut.time exists
                  ],
                },
                then: "loggedOut",
                else: null, // Optional: can set a default value if neither condition is met
              },
            },
          },
        },
        breakStatus: {
          $cond: {
            if: { $gt: [{ $size: "$breakData" }, 0] },
            then: {
              $let: {
                vars: {
                  lastBreak: { $arrayElemAt: ["$breakData", -1] },
                },
                in: {
                  $cond: {
                    if: {
                      $and: [
                        { $eq: ["$$lastBreak.breakIn", null] },
                        { $eq: ["$$lastBreak.breakOut", null] },
                      ],
                    },
                    then: "NA",
                    else: {
                      $cond: {
                        if: {
                          $and: [
                            { $ne: ["$$lastBreak.breakIn", null] },
                            { $not: [{ $gt: ["$$lastBreak.breakOut", null] }] },
                          ],
                        },
                        then: "breakIn",
                        else: "breakOut",
                      },
                    },
                  },
                },
              },
            },
            else: "NA", // If breakData array is empty, default to "NA"
          },
        },
        isDeleted: 1,
        createdAt: 1,
        updatedAt: 1,
        __v: 1,
      },
    },
  ]);

  return data[0] ?? {};
};

export const attendanceService = {
  markAttendance,
  getUserAttendance,
};
