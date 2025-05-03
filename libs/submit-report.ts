
import mongoose from 'mongoose';  

const MONGODB_URI = process.env.MONGODB_URI_ALERT!; 

let isConnected: boolean = false;  

const connectMongoDB = async () => {  
  if (isConnected) {  
    return; 
  }  
  try {  
    await mongoose.connect(MONGODB_URI);  
    isConnected = true; 
    console.log("MongoDB connected");  
  } catch (error) {  
    console.error("MongoDB connection error:", error);  
    throw new Error("Failed to connect to MongoDB");  
  }  
};  

export default connectMongoDB;