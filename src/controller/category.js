const Category = require('../model/category');
const slugify = require('slugify');

createCategories = (categories, parentId = null) => {
    const categoryList = [];
    let category;
    if(parentId == null){
        category = categories.filter(cat => cat.parentId == undefined);
    } else {
        category = categories.filter(cat => cat.parentId == parentId)
    }

    for(let cate of category) {
        categoryList.push({
            _id: cate._id,
            name: cate.name,
            slug: cate.slug,
            parentId: cate.parentId,
            categoryImage: cate.categoryImage,
            children: createCategories(categories, cate._id)
        });
    }

    return categoryList;
}

exports.addCategory = (req,res) => {
    const categoryObj = {
        name: req.body.name,
        slug: slugify(req.body.name),
    }

    if(req.file){
        categoryObj.categoryImage = req.file.filename;
    }

    if (req.body.parentId) {
        categoryObj.parentId = req.body.parentId;
    }

    const cat = new Category(categoryObj);
    cat.save((error, category) => {
        if(error) return res.status(400).json({error})
        if(category) {
            return res.status(201).json({category});
        }
    })
}

exports.getCategories = (req,res) => {
    Category.find({})
    .exec((error, categories) => {
        if(error) return res.status(400).json({error})
        
        if (categories) {
            const categoryList = createCategories(categories);

            res.status(200).json({ categoryList });
        }

    });
}

exports.getCategoryBySlug = (req, res) => {
    const { slug } = req.params;
    Category.findOne({ slug: slug})
    .select("_id name")
    .exec((error, category) => {
        if(error){
            return res.status(400).json({error});
        }
        if(category){
            Product.find({ category: category._id })
            .exec((error, products) => {
                if(error){
                    res.status(400).json({error});
                }
                if(products.length > 0){
                    res.status(200).json({
                        products
                    });
                }
                
            })
        }      
    });
}