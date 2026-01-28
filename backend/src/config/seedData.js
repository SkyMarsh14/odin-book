import createUser from "../lib/createUser.js";
const users = [];
users.push(await createUser("Guest", "password123"));
users.push(await createUser("yuto", "123"));
export { users };
