import { User } from "./model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { isAuth } from "./middleware.js";

 

export const registerUser = async(req,res)=>{
    try {
        const{ name, email, password} = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
            message: "Please enter all fields",
        });
        }

        const existingUser = await User.findOne({ email });

        if (existingUser) {
        return res.status(400).json({
            message: "User already exists",
        });
        }

    const hashPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
        name,
        email,
        password: hashPassword,
    });

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });

    res.status(201).json({
        message: "User Registered",
        user,
        token,
    })

        } catch (error) {
            console.log(error);
            res.status(500).json({
                message:"error in user register ",
            })
        }

    }


    export const loginUser = async(req,res)=>{
        try {
            const{email,password} = req.body;
            if(!email || !password) return res.status(404).json("enter all required filleds");
            const user= await User.findOne({email});

            if (!user) {
        res.status(404).json({
        message: "User not exists",
            })
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            res.status(400).json({
            message: "Invalid Password",
            });
            return;
        }

        const token = jwt.sign({_id:user._id},process.env.JWT_SECRET,{
            expiresIn: "7d",
        });

    res.status(200).json({
        message: "Logged IN",
        user,
        token,
    });


        }
        catch (error) {

            console.log(error)
            res.status(500).json({
                message:"error in user logIn ",
            })
        }
    }



export const myProfile = async (req, res) => {
    try {
        const user = req.user;

        if (!user) {
        return res.status(404).json({
            message: "User not found",
        });
        }

        return res.json(user);

    } catch (error) {
        console.error("Profile Error:", error);

        return res.status(500).json({
        message: "Error fetching profile",
        });
    }
    };


export const addToPlaylist = async (req, res) => {
    try {
        const user = req.user;
        const songId = req.params.id;

        if (!user) {
        return res.status(404).json({
            message: "User not found",
        });
        }

        // If already exists → remove
        if (user.playlist.includes(songId)) {
        const index = user.playlist.indexOf(songId);

        user.playlist.splice(index, 1);

        await user.save();

        return res.json({
            message: "Removed from playlist",
        });
        }

        // Otherwise → add
        user.playlist.push(songId);

        await user.save();

        return res.json({
        message: "Added to playlist",
        });

    } catch (error) {
        console.error("Playlist Error:", error);

        return res.status(500).json({
        message: "Error updating playlist",
        });
    }
    };


