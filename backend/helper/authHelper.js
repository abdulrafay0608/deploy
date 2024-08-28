import bcrypt from "bcrypt";

export const hashPassword = async (password) => {
  try {
    const saltRounds = 10;
    const hashPass = await bcrypt.hash(password, saltRounds);
    return hashPass;
  } catch (error) {
    console.log(`hash password error ${error}`);
  }
};

export const comparePassword = async (password, hashPass) => {
  return bcrypt.compare(password, hashPass);
};
