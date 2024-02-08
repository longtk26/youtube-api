import bcrypt from "bcryptjs";
import _ from "lodash";

const hashPassword = async (password) => {
  try {
    return await bcrypt.hash(password, 10);
  } catch (error) {
    console.log(`Error hash password: ${error.message}`);
  }
};

const comparePassword = async (password, hashedPassword) => {
  try {
    return await bcrypt.compare(password, hashedPassword);
  } catch (error) {
    console.log(`Error compare password: ${error.message}`);
  }
};

const getInfoData = (fields = [], object = {}) => {
  return _.pick(object, fields);
};

export { hashPassword, comparePassword, getInfoData };
