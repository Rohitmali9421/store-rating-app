import { PrismaClient } from '@prisma/client';
import { hashPassword } from '../utils/passwordHelper.js';

const prisma = new PrismaClient();

export const createUser = async (req, res) => {
  const { name, email, password, address, role } = req.body;

  if (role === 'STORE_OWNER') {
    return res.status(400).json({ message: 'Store Owners must be created via the "Add Store" form.' });
  }

  try {
    if (await prisma.user.findUnique({ where: { email } })) {
      return res.status(400).json({ message: 'User email already exists' });
    }
    const user = await prisma.user.create({
      data: { name, email, password: hashPassword(password), address, role },
    });
    res.status(201).json({ id: user.id, name: user.name, role: user.role });
  } catch (error) { res.status(500).json({ message: 'Server Error', error: error.message }); }
};

export const createStore = async (req, res) => {
  const { storeName, storeAddress, email, password, ownerName, ownerAddress } = req.body;

  try {
    const result = await prisma.$transaction(async (tx) => {
      // 1. Check if the email is already in use by a user or a store
      const userExists = await tx.user.findUnique({ where: { email: email } });
      if (userExists) {
        throw new Error('This email is already registered to a user.');
      }
      const storeExists = await tx.store.findUnique({ where: { email: email } });
      if (storeExists) {
        throw new Error('This email is already registered to a store.');
      }

      const newOwner = await tx.user.create({
        data: {
          name: ownerName,
          email: email,
          password: hashPassword(password),
          address: ownerAddress,
          role: 'STORE_OWNER',
        },
      });

      const newStore = await tx.store.create({
        data: {
          name: storeName,
          email: email,
          address: storeAddress,
          ownerId: newOwner.id,
        },
      });

      return { newOwner, newStore };
    });

    res.status(201).json(result.newStore);

  } catch (error) {
    res.status(400).json({ message: error.message || 'Failed to create store and owner.' });
  }
};


export const getAllUsers = async (req, res) => {
    const { name, email, address, role, page = 1, limit = 10, sortBy = 'name', order = 'asc' } = req.query;
    
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const where = {};
    if (name) where.name = { contains: name };
    if (email) where.email = { contains: email };
    if (address) where.address = { contains: address };
    if (role) where.role = role;
    
    try {
        const [users, totalItems] = await Promise.all([
            prisma.user.findMany({
                where,
                skip,
                take: limitNum,
                orderBy: { [sortBy]: order },
                include: {
                    ownedStore: { include: { ratings: { select: { value: true } } } }
                }
            }),
            prisma.user.count({ where })
        ]);

        const usersWithRatings = users.map(user => {
            const { password, ownedStore, ...userWithoutSensitiveData } = user;
            if (user.role === 'STORE_OWNER' && ownedStore) {
                const ratings = ownedStore.ratings;
                const averageRating = ratings.length > 0
                    ? (ratings.reduce((sum, r) => sum + r.value, 0) / ratings.length).toFixed(1)
                    : '0.0';
                return { ...userWithoutSensitiveData, storeAverageRating: averageRating };
            }
            return userWithoutSensitiveData;
        });

        res.json({
            data: usersWithRatings,
            pagination: {
                currentPage: pageNum,
                totalPages: Math.ceil(totalItems / limitNum),
                totalItems,
            }
        });
    } catch (error) { 
        console.error(error);
        res.status(500).json({ message: 'Server Error' }); 
    }
};

export const getAllStores = async (req, res) => {
    const { name, email, address, page = 1, limit = 10, sortBy = 'name', order = 'asc' } = req.query;

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const where = {};
    if (name) where.name = { contains: name };
    if (email) where.email = { contains: email };
    if (address) where.address = { contains: address }; 
    
    try {
        const [stores, totalItems] = await Promise.all([
             prisma.store.findMany({
                where,
                skip,
                take: limitNum,
                include: { _count: { select: { ratings: true } }, ratings: { select: { value: true } } },
                orderBy: { [sortBy]: order }
            }),
            prisma.store.count({ where })
        ]);

        const result = stores.map(s => {
            const totalRating = s.ratings.reduce((acc, r) => acc + r.value, 0);
            const averageRating = s._count.ratings > 0 ? (totalRating / s._count.ratings).toFixed(1) : '0.0';
            const { ratings, _count, ...storeData } = s;
            return { ...storeData, rating: averageRating };
        });

        res.json({
            data: result,
            pagination: {
                currentPage: pageNum,
                totalPages: Math.ceil(totalItems / limitNum),
                totalItems,
            }
        });
    } catch (error) { 
        console.error(error);
        res.status(500).json({ message: 'Server Error' }); 
    }
};

export const getDashboardStats = async (req, res) => {
    try {
        const userCount = await prisma.user.count();
        const storeCount = await prisma.store.count();
        const ratingCount = await prisma.rating.count();
        res.json({ users: userCount, stores: storeCount, ratings: ratingCount });
    } catch (error) { 
        console.error(error);
        res.status(500).json({ message: 'Server Error' }); 
    }
};