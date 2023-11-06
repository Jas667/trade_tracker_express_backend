//Middleware not currently in use

// const jwt = require("jsonwebtoken");

// module.exports = {
//   authorise(req, res, next) {
//     const token = req.cookies.token;

//     if (!token) return res.status(401).send({ message: "Access Denied" });

//     jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
//       if (err && err.name === "TokenExpiredError") {
//         // Token has expired; let the client handle it by requesting a new token
//         return res.status(401).send({ message: "Access token expired" });
//       } else if (err) {
//         return res.status(403).send({ message: "Invalid Token" });
//       }

//       req.userId = user.id;
//       next();
//     });
//   },
// };
