import express from 'express'
import ICategory from '../models/ICategory.js'
import ICategoryDetail from '../models/ICategoryDetail.js'

const router = express.Router();

router.get('/:categoryName', async (req, res) => {
    const {categoryName} = req.params;

    try{
        const category = await ICategory.findOne({name : categoryName});
        if (!category) return res.status(404).json({ error: '카테고리를 찾을 수 없습니다.' });

        const count = 3;

        const details = await ICategoryDetail.aggregate([
            { $match: {categoryId: category._id}},
            { $sample : {size: count}}
        ]);   
        res.json(details.modifiedPaths(d => d.content));
    }catch(err){
        res.status(500).json({ error: '서버 오류' });
    }
})

export default router;