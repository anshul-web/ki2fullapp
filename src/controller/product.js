const Product = require('../model/product');
const shortid = require('shortid');
const slugify = require('slugify');
const Category = require('../model/category');
const category = require('../model/category');


exports.createProduct = (req, res) => {

    //res.status(200).json( { file: req.files, body: req.body } );

    const {
        name, price, productCategory, description, category, quantity, createdBy
    } = req.body;
    let productPictures = [];

    if(req.files.length > 0){
        productPictures = req.files.map(file => {
            return { img: file.filename }
        });
    }

    const product = new Product({
        name: name,
        slug: slugify(name),
        price,
        productCategory,
        quantity,
        description,
        productPictures,
        category,
        createdBy: req.user._id
    });

    product.save(((error, product) => {
        if(error) return res.status(400).json({ error });
        if(product){
            res.status(201).json({ product });
        }
    }));


};


getAllProduct = (products) => {
    const productList = [];
    
    for(let product of products){
        productList.push({
            _id: product._id,
            name: product.name,
            slug: product.slug,
            price: product.price,
            productCategory: product.productCategory,
            quantity: product.quantity,
            description: product.description,
            productPictures: product.productPictures
        });
    }
    return productList;
}

exports.getProductsBySlug = (req, res) => {
    const { slug } = req.params;
    Category.findOne({ slug: slug})
    .select("_id name")
    .exec((error, category) => {
        if(error){
            return res.status(400).json({error});

        }
        if(category){
            Category.find({ parentId: category._id })
            .select("_id name")
            .exec((error, categories) => {
                subCategories = categories;

            Product.find({ category: category._id })
            .exec((error, products) => {
                if(error){
                    res.status(400).json({error});
                }
                if(products.length > 0){
                    res.status(200).json({
                        products,
                        subCategories
                    });
                }else{
                    res.status(200).json({
                        message: "No productsfor this Category"
                    })
                }
                
            })
            })
            
        }
        
    });
    
}

exports.getProductDetailsById = (req, res) => {
    const { category } = req.params;
    res.status(200).json({category});

    // if(productId){
    //     Product.findOne({ _id: productId })
    //     .exec((error, product) => {
    //         if(error) return res.status(400).json({ error });
    //         if(product){
    //             res.status(200).json({ product });
    //         }
    //     });
    // }else{
    //     return res.status(400).json({ error: 'Params required' });
    // }
}

exports.getProducts = (req,res) => {
    Product.find({})
    .exec((error, products) => {
        if(or) return res.status(400).json({error})

        if(products) {
            const productList = getAllProduct(products);
            res.status(200).json( {productList });
            
        }
    });
}