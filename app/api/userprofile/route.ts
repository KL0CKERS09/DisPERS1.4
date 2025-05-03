// pages/api/user/profile.ts  
import { NextApiRequest, NextApiResponse } from 'next';  
import { connectToDB } from "@/libs/mongodb";
import User from '../../../models/login';  
import { authenticate } from '../../../libs/auth';  

export default async function handler(req: NextApiRequest, res: NextApiResponse) {  
  await connectToDB();  

  const token = req.headers.authorization?.split(' ')[1];  
  if (!token) return res.status(401).json({ message: 'Unauthorized' });  

  try {  
    const userId = authenticate(token).userId;  
    const user = await User.findById(userId).lean();  

    if (!user) return res.status(404).json({ message: 'User not found' });  

    res.json(user);  
  } catch (error) {  
    res.status(401).json({ message: 'Invalid token' });  
  }  
}