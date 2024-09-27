const errorMessages = {
  unauthorized: "You are unauthorized to access this platform",
  invalidCredentials: "Invalid password",
  emailSendFailed: "Email send failed",
  linkExpired: "The link you are trying to access has expired",
  categoryNotFound: "Category not found with id",
  postNotFount: "Post not found by Id",
  passwordNotMatch: "Old password not match",
  chatNotFount: "Chat not found by this user",
  userAlreadyJoined: "You are already in the group",
  userNotINTheGroup: "User not joined the group",
  roomNotFound: "Room not found",

  /// /////////////////////////////////
  companyEmailExists: "Company already Exists with this EmailId",
  companyPhoneNumberExists: "Company already Exists with this PhoneNumber",
  industryNotFount: "Industry not found",
  industryExists: "Industry name already exists",
  inValidEmail: "Invalid Email",
  invalidPassword: "Invalid Password",
  departmentExists: "Department Already exists",
  departmentNotFound: "Department not found",
  roleExists: "Role Already exists",
  roleNotFound: "Role not found",
  userExists: "User already exists",
  companyNotFound: "Company Not found",
  userNotFound: "User not found",
  invalidOldPassword: "Invalid old password",
  workHistoryExists: "Employ Work history already exists",
  workHistoryNotfound: "WorkHistory not found",
  userAccountBlocked:
    "Your account has been blocked, contact Admin for more details",
};

const successMessages = {
  linkSend: "Link successfully send to mail",
  healthOk: "Server is healthy",
  industryDeleted: "Industry Deleted successfully",
  departmentDeleted: "Department Deleted successfully",
  roleDeleted: "Role Deleted successfully",
  companyDeleted: "Company Deleted successfully",
};

export { errorMessages, successMessages };
