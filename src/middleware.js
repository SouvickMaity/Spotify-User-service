    import jwt from "jsonwebtoken";
    import { User } from "./model.js";

    export const isAuth = async (req, res, next) => {
    try {
        const token = req.headers.token;

        if (!token) {
        return res.status(403).json({
            message: "Please Login",
        });
        }

        const decodedValue = jwt.verify(
        token,
        process.env.JWT_SECRET
        );

        if (!decodedValue || !decodedValue._id) {
        return res.status(403).json({
            message: "Invalid token",
        });
        }

        const user = await User.findById(decodedValue._id).select("-password");

        if (!user) {
        return res.status(403).json({
            message: "User Not found",
        });
        }

        // Attach user to request
        req.user = user;

        next();
    } catch (error) {
        return res.status(403).json({
        message: "Please Login",
        });
    }
    };


