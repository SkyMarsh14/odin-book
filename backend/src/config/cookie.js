const cookieConfig = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  maxAge: 2 * 24 * 60 * 60 * 1000, // 2 days
  path: "/",
  partitioned: process.env.NODE_ENV === "production",
};

export default cookieConfig;
