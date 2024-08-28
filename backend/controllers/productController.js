import { ApiFeature } from "../helper/apiFeature.js";
import productModel from "../models/productModel.js";

// create product this is only admin route
export const createProductController = async (req, res) => {
  try {
    req.body.user = req.user.id;
    const product = await productModel.create(req.body);
    res
      .status(200)
      .send({ success: true, message: "Create Product Successfully", product });
  } catch (error) {
    console.log(`Create Product Error ${error}`);
    res.status(500).send({ success: false, message: "something went wrong" });
  }
};

// get all product this is public route

export const getAllProductController = async (req, res) => {
  try {
    const perPage = 8;
    const productCount = await productModel.countDocuments();

    // Initialize the ApiFeature object for filtering and searching
    const apiFeature = new ApiFeature(productModel.find(), req.query)
      .search()
      .filter();

    let product = await apiFeature.query.clone(); // Clone the query to avoid reuse issues

    const filterProductCount = product.length;

    // Initialize a new ApiFeature object for pagination
    const paginatedApiFeature = new ApiFeature(productModel.find(), req.query)
      .search()
      .filter()
      .pagination(perPage);

    product = await paginatedApiFeature.query.clone(); // Clone the query to avoid reuse issues

    res.status(200).send({
      success: true,
      message: "Get All Products Successfully",
      productCount,
      perPage,
      filterProductCount,
      product,
    });
  } catch (error) {
    console.log(`Get All Product Error: ${error}`);
    res.status(500).send({ success: false, message: "Something went wrong" });
  }
};

// get product detail this is public route

export const productDetailController = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.id);

    if (!product) {
      return res.status(404).send({
        success: false,
        message: "Product Detail not found",
      });
    }

    res.status(200).send({
      success: true,
      message: "Get Product Detail Successfully",
      product,
    });
  } catch (error) {
    console.log(`Deleted Product Error ${error}`);
    res.status(500).send({ success: false, message: "something went wrong" });
  }
};

// update product this is admin route

export const updateProductController = async (req, res) => {
  try {
    const product = await productModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!product) {
      return res.status(404).send({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).send({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    console.log(`Update Product Error ${error}`);
    res.status(500).send({ success: false, message: "something went wrong" });
  }
};

// delete product this is adimin route

export const deleteProductController = async (req, res) => {
  try {
    await productModel.findByIdAndDelete(req.params.id);

    res.status(200).send({
      success: true,
      message: "Product Delete Successfully",
    });
  } catch (error) {
    console.log(`Deleted Product Error ${error}`);
    res.status(500).send({ success: false, message: "something went wrong" });
  }
};

// create review
export const createProductReviewController = async (req, res) => {
  try {
    const { rating, comment, productId } = req.body;

    const review = {
      user: req.user._id,
      name: req.user.name,
      rating: Number(rating),
      comment,
    };

    const product = await productModel.findById(productId);

    const isReviewed = product.reviews.find(
      (rev) => rev.user.toString() === req.user._id.toString()
    );

    if (isReviewed) {
      product.reviews.forEach((rev) => {
        if (rev.user.toString() === req.user._id.toString()) {
          rev.rating = rating;
          rev.comment = comment;
        }
      });
    } else {
      product.reviews.push(review);
      product.numOfReviews = product.reviews.length;
    }

    let avg = 0;

    product.reviews.forEach((rev) => {
      avg += rev.rating;
    });

    product.ratings = avg / product.reviews.length;

    await product.save({ validateBeforeSave: false });

    res.status(200).send({
      success: true,
      message: "Product Review Submit Successfully",
      product,
    });
  } catch (error) {
    console.log(`Product Review Error ${error}`);
    res.status(500).send({ success: false, message: "something went wrong" });
  }
};

// Get All Reviews of a product
export const getAllReviewsController = async (req, res) => {
  try {
    const product = await productModel.findById(req.query.id);

    if (!product) {
      return res.status(404).send({
        success: false,
        message: "Product not Fonud",
      });
    }

    res.status(200).json({
      success: true,
      message: "Get All Review Successfully",
      reviews: product.reviews,
    });
  } catch (error) {
    console.log(`Get All Review Error ${error}`);
    res.status(500).send({ success: false, message: "something went wrong" });
  }
};

// Delete Review
export const deleteReviewController = async (req, res) => {
  try {
    const product = await productModel.findById(req.query.productId);

    if (!product) {
      return res.status(404).send({
        success: false,
        message: "Product not Fonud",
      });
    }

    const reviews = product.reviews.filter(
      (rev) => rev._id.toString() !== req.query.id.toString()
    );

    let avg = 0;

    reviews.forEach((rev) => {
      avg += rev.rating;
    });

    let ratings = 0;

    if (reviews.length === 0) {
      ratings = 0;
    } else {
      ratings = avg / reviews.length;
    }

    const numOfReviews = reviews.length;

    await productModel.findByIdAndUpdate(
      req.query.productId,
      { reviews, ratings, numOfReviews },
      { new: true, runValidators: true, useFindAndModify: false }
    );

    res.status(200).send({
      success: true,
      message: "Review Deleted Successfully",
    });
  } catch (error) {
    console.log(`Delete Review Error ${error}`);
    res.status(500).send({ success: false, message: "something went wrong" });
  }
};
