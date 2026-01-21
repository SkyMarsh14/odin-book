const protectRoute = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next(0);
  }
  res.status(401).json({
    msg: "This is a protected route that requires a login",
  });
};

export default protectRoute;
