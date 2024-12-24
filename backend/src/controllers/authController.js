import {request, response} from 'express';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import User from '../models/users.model.js';
import UserDetail from '../models/userDetail.model.js';
import bcrypt from 'bcryptjs';
import { JWT_SECRET } from '../middleware/verifyToken.js';

dotenv.config();

//const JWT_SECRET = process.env.JWT_SECRET;

export const signup1 =  async (request, response) => {
    console.log("Request Body:", request.body);

    try {
        const existingSid = await User.findOne({sid: request.body.sid });
        if (existingSid) {
            console.log("A User with this sid already exists!");
            return response.status(400).send("A User with this sid already exists!");
        }

        const existingUser = await User.findOne({ email: request.body.email });
        if (existingUser) {
            console.log("Cannot use the same email more than once!");
            return response.status(400).send("This email is already in use!");
        }

        //const data = new User(request.body);
        const hashedPassword = await bcrypt.hash(request.body.password, 10);

        const data = new User({
            name: request.body.name, 
            sid : request.body.sid,
            email : request.body.email,
            password: hashedPassword,
        });
        const result = await data.save();
        
        const token = jwt.sign({ 
            name: data.name,
            sid: data.sid, 
            email: data.email,
         }, JWT_SECRET, { expiresIn: "30m",}
        );

        console.log("Successful signup (part 1)!");
        response.status(200).json({ message: "signup part 1 successful!", 
            token: token});
    } catch (error) {
        console.error("Error during signup:", error);
        response.status(500).send("An error occurred during signup.");
    }
};

export const signup2 = async (request, response) => {
    try {
        let sid = request.user.sid;
        const existingSid = await UserDetail.findOne({ sid: sid });
        if (existingSid) {
            console.log("A User with this sid already exists!");
            return response.status(400).send("A User with this sid already exists!");
        }

        const data = new UserDetail({
            sid: sid,
            branch: request.body.branch,
            phoneNumber: request.body.phoneNumber,
            parentsNumber: request.body.parentsNumber
        })

        const result = await data.save();
        response.status(201).json({ message: "Signup complete!", sid: result.sid});
    }
    catch (error) {
        console.error("Error during signup:", error);
        response.status(500).send("An error occurred during signup.");
    }

}

export const login = async (request, response) => {
    try {
        const existingUser = await User.findOne({email : request.body.email });
        if  (!existingUser) {
            console.log("No such User on platform! You should sign up");
            return response.status(400).send("No such User on platform! You should sign up");
        }

        const isValidPassword = await bcrypt.compare(request.body.password, existingUser.password);

        if (!isValidPassword) {
            console.log("Incorrect password!");
            return response.status(400).send("Incorrect password!");
        }

        const token = jwt.sign({ 
            name: existingUser.name,
            sid: existingUser.sid, 
            email: existingUser.email,
         }, JWT_SECRET, { expiresIn: "30m",}
        );

        console.log("Successful login!");
        response.status(200).json({ message: "Login successful!", 
            token: token});
    }
     catch (error) {
        console.error("Error during login:", error);
        response.status(500).send("An error occurred during login.");
    }
};





