const Product = require("../../models/Product");

const getFilteredProducts = async (req, res) => {
  try {
    const { category = [], product = [], sortBy = "price-lowtohigh", page = 1, limit = 10 } = req.query;

    let filters = {};
    if (category.length) filters.category = { $in: category.split(",") };
    if (product.length) filters.product = { $in: product.split(",") };

    let sort = {};
    switch (sortBy) {
      case "price-lowtohigh": sort.price = 1; break;
      case "price-hightolow": sort.price = -1; break;
      case "title-atoz": sort.title = 1; break;
      case "title-ztoa": sort.title = -1; break;
      default: sort.price = 1; break;
    }

    const skip = (page - 1) * limit;
    const products = await Product.find(filters).sort(sort).skip(skip).limit(Number(limit));
    const total = await Product.countDocuments(filters);

    res.status(200).json({
      success: true,
      data: products,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (e) {
    res.status(500).json({ success: false, message: "Some error occurred" });
  }
};

const getProductDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product)
      return res.status(404).json({
        success: false,
        message: "Product not found!",
      });

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (e) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Some error occured",
    });
  }
};

module.exports = { getFilteredProducts, getProductDetails };
