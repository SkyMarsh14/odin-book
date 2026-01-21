import bcrypt from "bcryptjs";
async function createUser(name, password) {
  return {
    name,
    password: await bcrypt.hash(password, 10),
  };
}

export default createUser;
