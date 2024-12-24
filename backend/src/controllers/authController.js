import {request, response} from 'express';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import User from '../models/users.model.js';
import UserDetail from '../models/userDetail.model.js';
import bcrypt from 'bcryptjs';
dotenv.config();

const JWT_SECRET = "secretkey"
//const JWT_SECRET = process.env.JWT_SECRET;

export const signup1 =  async (request, response) => {
    console.log("Request Body:", request.body);

    try {
        const existingSid = await User.findOne({sid: request.body.sid });
        if (existingSid) {
            console.log("A User with this sid already exists!");
            return response.status(400).send("A User with this sid already exists!");
        }

        const existingEmail = await User.findOne({ email: request.body.email });
        if (existingEmail) {
            console.log("Cannot use the same email more than once!");
            return response.status(400).send("This email is already in use!");
        }

        //const data = new User(request.body);
        const hashedPassword = await bcrypt.hash(request.body.password, 10);
        const data = new User({ ...request.body, password: hashedPassword });
        const result = await data.save();
        response.status(201).json({ message: "Part one of signup successful!", sid: result.sid });
    } catch (error) {
        console.error("Error during signup:", error);
        response.status(500).send("An error occurred during signup.");
    }
};

export const signup2 = async (request, response) => {
    //params has sid
    try {
        let sid = request.params.sid;
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

export const authenticateToken = (request, response, next) => {
    const authHeader = request.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return response.status(401).send("Access Denied: No Token Provided!");

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return response.status(403).send("Invalid Token!");
        request.user = user; 
        next();
    });
};

export const login = async (request, response) => {
    try {
        const existingEmail = await User.findOne({email : request.body.email });
        if (!existingEmail) {
            console.log("No such User on platform! You should sign up");
            return response.status(400).send("No such User on platform! You should sign up");
        }

        const isValidPassword = existingEmail.password === request.body.password;
        if (!isValidPassword) {
            return response.status(400).send("Incorrect details!");
        }

        const token = jwt.sign({ sid: existingEmail.sid, email: existingEmail.email }, JWT_SECRET, { expiresIn: "30m",},(error,token)=>{
            console.log("TOKEN :" + token);
        }
        );

        console.log("Successful login!");
        response.status(200).json({ message: "Login successful!", token });
    }

        // let result = await User.findOne({
        //     email: request.body.email,
        //     password: request.body.password
        // });

        // if (result) {
        //     console.log("Successful login!");
        //     // response.render('home');
        //     response.send('home page');
        // }
        // else {
        //     return response.status(400).send("Incorrect details!");
        // } }
     catch (error) {
        console.error("Error during login:", error);
        response.status(500).send("An error occurred during login.");
    }
};





