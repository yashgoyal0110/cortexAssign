import jwt from "jsonwebtoken";

export const authenticate = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "Unauthorized: No token" });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(401).json({ message: "Unauthorized: Invalid token" });
            }
        })
        req.user = decoded;
        next();
    }
    catch (error) {
        console.error("Error during authentication:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
