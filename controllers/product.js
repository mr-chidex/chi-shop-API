import Products from "../model/product.js";

//@desc Fetch all products
//@access Public
//@route GET /api/products
export const getProducts = async (req, res, next) => {
  try {
    const products = await Products.find();
    if (!products) {
      return res.status(404).json({ error: "Products not found" });
    }

    res.json({ products });
  } catch (error) {
    next(new Error(error));
  }
};

//@desc Add new product
//@Route POST /api/products
//@access Private
export const addProduct = async (req, res, next) => {
  try {
    const {
      name,
      image,
      description,
      brand,
      category,
      price,
      countInStock,
      rating,
      numReviews,
    } = req.body;

    const newProduct = await new Products({
      name,
      image,
      description,
      brand,
      category,
      price,
      countInStock,
      rating,
      numReviews,
      user: req.user._id,
    });

    await newProduct.save();

    res
      .status(201)
      .json({ message: "product added successfully", product: newProduct });
  } catch (error) {
    next(error);
  }
};

//@desc Fetch single product
//@access Public
//@route GET /api/products/:id
export const getProduct = async (req, res, next) => {
  try {
    const product = await Products.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: "Products not found" });
    }

    res.json({ product });
  } catch (error) {
    next(new Error(error));
  }
};
