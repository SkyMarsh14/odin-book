import createUser from "../lib/createUser.js";
const users = [];
users.push(await createUser("Guest", "password123"));

export { users };
