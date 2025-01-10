import HostelFee from '../../models/hostelFees.model.js';
import Stripe from 'stripe';
import dotenv from 'dotenv';
import crypto from 'crypto';

dotenv.config(); 

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const initiatePayment= async (req, res) => {
  try {
      const name = req.user.name;
      const studentId = req.user.sid; 
      const amount = req.body.amount;

    await HostelFee.findOneAndUpdate(
        { studentId }, 
        { name, studentId, amount, status: 'pending' }, 
        { new: true, upsert: true } 
      );

      const session = await stripe.checkout.sessions.create({
          payment_method_types: ['card'],
          mode: 'payment',
          line_items: [
              {
                  price_data: {
                      currency: 'USD',
                      product_data: {
                          name: `Mess Fee Payment - Student ID: ${studentId}`,
                      },
                      unit_amount: amount * 100, 
                  },
                  quantity: 1,
              },
          ],
          metadata: {
            studentId,
            name,
            amount,
          },
          success_url: "http://localhost:5173/hostel_success?session_id={CHECKOUT_SESSION_ID}",
          cancel_url: "http://localhost:5173/hostel_cancel",
 
      });
      res.json({success:true, id: session.id});
  } catch (error) {
        console.error("Payment gateway failed:", error);

        res.status(500).json({ success: false, error: "Failed to process payment"});

  }
}; 

export const updateFeeStatus = async (req, res) => {
  const { sessionId } = req.body;

  if (!sessionId) {
    return res.send("Invalid sessionId");
  }
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    
    if (session.payment_status === 'paid') {
      const { studentId, name, amount } = session.metadata;

      await Fee.findOneAndUpdate(
        { studentId }, 
        {
          status: 'paid',
          amount: amount, 
        },
        { new: true, upsert: true }
      );

      console.log(`Fee status updated to 'paid' for studentId: ${studentId}`);
      res.redirect('http://localhost:5173/hostel_success');
    } else {
      console.log('Payment not completed for sessionId:', sessionId);
      res.redirect('http://localhost:5173/hostel_cancel');
    }
  } catch (err) {
    console.error(`Failed to update payment status: ${err.message}`);
    res.status(500).json({ error: err.message });
  }
};
                  
export const getFeeStatus = async (req, res) => {
  try {
      const studentId  = req.user.sid;
      const name = req.user.name;

      if (!studentId) {
        return res.send("Invalid studentId");
    }

     let fee = await HostelFee.findOne({ studentId });
      res.json({ name:fee.name, studentId: fee.studentId, status: fee.status, amount :fee.amount });
  } 
  catch (error) {
      console.error({error:error.message});
      res.status(500).json({ error: error.message });
  }
};
