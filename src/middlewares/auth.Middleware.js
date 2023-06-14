const jwt = require("jsonwebtoken");
const User = require("../models/users.model");

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res
        .status(401)
        .json({ message: "No se proporcionó un token de sesión" });
    }
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    // console.log("ver token ", decodedToken);
    const user = await User.findById(decodedToken.idUser);
    if (!user) {
      return res.status(401).json({ message: "Token de sesión inválido no id" });
    }
    req.user = user;
    req.tokenExpirationDate = new Date(decodedToken.exp * 1000);
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res
        .status(200)
        .json({
          code: 3003,
          url: "/login",
          message: "El token ha expirado",
        });
    } else if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: "Token de sesión inválido" });
    }
    console.error(error);
    res
      .status(500)
      .json({ message: "Hubo un error al verificar el token de sesión" });
  }
};


module.exports = authMiddleware;
