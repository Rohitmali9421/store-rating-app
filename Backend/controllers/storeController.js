import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const getStoresForUser = async (req, res) => {
    const { name, address, sortBy = 'name', order = 'asc', page = 1, limit = 10 } = req.query;
    
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const where = {};
    if (name) where.name = { contains: name };
    if (address) where.address = { contains: address };
    
    try {
        const [stores, totalItems] = await Promise.all([
            prisma.store.findMany({
                where,
                skip,
                take: limitNum,
                include: { ratings: true },
                orderBy: { [sortBy]: order }
            }),
            prisma.store.count({ where })
        ]);

        const result = stores.map(store => {
            const totalRating = store.ratings.reduce((acc, r) => acc + r.value, 0);
            const averageRating = store.ratings.length > 0 ? (totalRating / store.ratings.length).toFixed(1) : '0.0';
            const userSubmittedRatingObj = store.ratings.find(r => r.userId === req.user.id);
            return {
                id: store.id,
                name: store.name,
                address: store.address,
                overallRating: parseFloat(averageRating),
                userSubmittedRating: userSubmittedRatingObj ? userSubmittedRatingObj.value : null
            };
        });
        
        res.json({
            data: result,
            pagination: {
                currentPage: pageNum,
                totalPages: Math.ceil(totalItems / limitNum),
                totalItems,
            }
        });

    } catch (error) { res.status(500).json({ message: 'Server Error', error: error.message }); }
};

export const rateStore = async (req, res) => {
    const { storeId } = req.params;
    const { value } = req.body;
    try {
        const rating = await prisma.rating.upsert({
            where: {
                userId_storeId: { 
                    userId: req.user.id,
                    storeId: parseInt(storeId),
                },
            },
            update: { value },
            create: {
                value,
                userId: req.user.id,
                storeId: parseInt(storeId),
            },
        });
        res.status(201).json(rating);
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

export const getOwnerDashboard = async (req, res) => {
    const { page = 1, limit = 10, sortBy = 'name', order = 'asc' } = req.query;
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    try {
        const store = await prisma.store.findUnique({
            where: { ownerId: req.user.id },
        });

        if (!store) {
            return res.status(404).json({ message: 'Store not found for this owner.' });
        }

        const [ratingsData, aggregateData] = await Promise.all([
            prisma.rating.findMany({
                where: { storeId: store.id },
                skip,
                take: limitNum,
                orderBy: {
                    [sortBy === 'rating' ? 'value' : 'user']: sortBy === 'rating' ? order : { [sortBy]: order },
                },
                include: {
                    user: { select: { name: true, email: true, address: true } } 
                }
            }),
            prisma.rating.aggregate({
                _avg: { value: true },
                _count: { value: true },
                where: { storeId: store.id },
            })
        ]);

        const totalItems = aggregateData._count.value;
        const averageRating = aggregateData._avg.value || 0;
        
        res.json({
            storeName: store.name,
            averageRating: parseFloat(averageRating.toFixed(1)),
            ratings: {

                data: ratingsData.map(r => ({
                    name: r.user.name,
                    email: r.user.email,
                    address: r.user.address, 
                    rating: r.value
                })),
                pagination: {
                    currentPage: pageNum,
                    totalPages: Math.ceil(totalItems / limitNum),
                    totalItems,
                }
            }
        });
    } catch (error) { 
        console.error(error);
        res.status(500).json({ message: 'Server Error', error: error.message }); 
    }
};