import { PrismaClient } from '@prisma/client';
import { hashPassword, comparePassword } from '../utils/passwordHelper.js';
import { generateToken } from '../utils/jwtHelper.js';

const prisma = new PrismaClient();

export const registerUser = async (req, res) => {
  const { name, email, password, address } = req.body;
  try {
    if (await prisma.user.findUnique({ where: { email } })) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const user = await prisma.user.create({
      data: { name, email, password: hashPassword(password), address, role: 'NORMAL_USER' },
    });

    res.status(201).json({ 
        id: user.id, 
        name: user.name, 
        role: user.role, 
        token: generateToken(user.id) 
    });
  } catch (error) { 
      res.status(500).json({ message: 'Server Error' }); 
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (user && comparePassword(password, user.password)) {
      res.json({ id: user.id, name: user.name, role: user.role, token: generateToken(user.id) });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) { res.status(500).json({ message: 'Server Error' }); }
};
export const updatePassword = async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id; 

    try {
        const user = await prisma.user.findUnique({ where: { id: userId } });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isMatch = comparePassword(currentPassword, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid current password' });
        }
        
        const hashedNewPassword = hashPassword(newPassword);

        await prisma.user.update({
            where: { id: userId },
            data: { password: hashedNewPassword },
        });

        res.status(200).json({ message: 'Password updated successfully!' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error while updating password' });
    }
};