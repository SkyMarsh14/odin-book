import { PrismaClient } from "../generated/prisma/default.js";
const prisma = new PrismaClient({
  omit: {
    user: {
      password: true,
    },
  },
});

export default prisma;
