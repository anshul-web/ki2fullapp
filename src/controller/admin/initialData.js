const Category = require('../../model/category');
const Product = require('../../model/product');
const Order = require('../../model/order');

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
            children: createCategories(categories, cate._id)
        });
    }

    return categoryList;
}


exports.initialData = async (req, res) => {

    const categories = await Category.find({}).exec();
    const products = await Product.find({})
        .select('_id name price productCategory quantity slug description productPictures category')
        .populate({ path: 'category', select: '_id name categoryImage children' })
        .exec();
    const orders = await Order.find({})
        .populate("items.productId", "name")
        .exec();
        res.status(200).json({
            categories: createCategories(categories),
            products,
            orders,
        });

};