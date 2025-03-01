import MessPayDetails from '../models/messPaymentDetails.model.js'; 
import dotenv from 'dotenv';

export const getDetails = async (req,res) => {
    const {sid} = req.user;
    try {
        const detailS = await MessPayDetails.findOne({sid});
        console.log("detailS : ",detailS);
        if (!detailS) {
            return res.json({ message: 'No details found for this SID' });
        }
        // Filtering the details for status 'pending'
        const pendingDetails = detailS.details.filter(detail => detail.status === 'pending');
        const reversedDetails = pendingDetails.reverse();
        res.status(200).json(reversedDetails);
        
    } catch (error) {
        console.error("Error fetching details:", error);
        res.status(500).send("An error occurred while fetching details.");
    }
};


export const add_details = async (sid,name,month,year,amount,rebate,final_amount,status) => {
  try {
      const newDetails = {month,year,amount,rebate,final_amount,status};

      const student = await MessPayDetails.findOneAndUpdate(
          { sid },
          {
              $push: {details: newDetails }, 
          },
          { new: true, upsert: true } 
      );

      console.log("Details added successfully:");
  } catch (error) {
      console.error("Error adding details:", error);
  }
};