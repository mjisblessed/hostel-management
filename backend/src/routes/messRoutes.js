import express from 'express';
import { verifyToken } from '../middleware/verifyToken.js';
import { MessLeaveForm } from '../controllers/messController.js';

const router = express.Router();

// router.get("/status", verifyToken, getMessStatus);
//router.post("/pay", verifyToken, payMessFees);
router.post("/off", verifyToken, MessLeaveForm);

export default router; 