import bcrypt from "bcryptjs";
import User from "../models/user-model.js";
import generateTokenAndSetCookie from "../utils/generate-token.js";

export const signup = async (req, res) => {
    try {
        const { fullname, username, password, confirmPassword, gender } = req.body;

        if (password !== confirmPassword) {
            return res.status(400).json({ error: "Password do not match" })
        }

        const user = await User.findOne({ username });

        if (user) {
            return res.status(400).json({ error: "Username already exists" })
        }

        // Hashing Password
        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Auto generate profile picture based on gender and username
        const maleProfilePicture = `https://avatar.iran.liara.run/public/boy?username=${username}`
        const femaleProfilePicture = `https://avatar.iran.liara.run/public/girl?username=${username}`

        const createUser = new User({
            fullname,
            username,
            password: hashedPassword,
            gender,
            profile_pic: gender === "male" ? maleProfilePicture : femaleProfilePicture
        });

        if (createUser) {
            // Generate JWT token here
            generateTokenAndSetCookie(createUser._id, res);

            await createUser.save();

            res.status(201).json({
                _id: createUser._id,
                fullname: createUser.fullname,
                username: createUser.username,
                profile_pic: createUser.profile_pic
            });
        } else {
            res.status(400).json({ error: "Invalid user data" });
        }

    } catch (error) {
        console.log("Error in signup controller: ", error.message);
        res.status(500).json({
            error: "Internal Server Error",
            error_message: error.message || error
        })
    }
};

export const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ username });
        const checkPassword = await bcrypt.compare(password, user?.password || "");

        if (!user || !checkPassword) {
            return res.status(400).json({ error: "Invalid credentials" })
        }

        generateTokenAndSetCookie(user._id, res);

        res.status(200).json({
            _id: user._id,
            fullname: user.fullname,
            username: user.username,
            profile_pic: user.profile_pic
        });

    } catch (error) {
        console.log("Error in login controller: ", error.message)
        res.status(500).json({
            error: "Internal Server Error",
            error_message: error.message || error
        })
    }
};

export const logout = (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 });
        res.status(200).json({ message: "Logged out successfully." });

    } catch (error) {
        console.log("Error in logout controller: ", error.message)
        res.status(500).json({
            error: "Internal Server Error",
            error_message: error.message || error
        })
    }
};