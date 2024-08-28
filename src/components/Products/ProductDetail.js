import "./ProductDetail.css";

import React, { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  clearError,
  fetchProductDetail,
} from "../../features/productDetailSlice";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";
import ProductsReviews from "./ProductsReviews";
import Loader from "../Loader/Loader";
import ReactStar from "react-rating-stars-component";
import MetaData from "../Layout/MetaData";

const ProductDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { product, loading, error } = useSelector(
    (state) => state.productDetail
  );

  useEffect(() => {
    dispatch(fetchProductDetail(id));

    return () => {
      dispatch(clearError());
    };
  }, [dispatch, id]);

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <MetaData title={"Product Detail - Ecommerce"} />
          <div className="flex justify-center gap-10 mt-10 mx-auto">
            <div className="w-[100vmin]">
              <Carousel
                infiniteLoop={true}
                showIndicators={false}
                showStatus={false}
                thumbWidth={50}
                autoPlay={true}
                stopOnHover
                interval={3000}
                className="productCarousel"
              >
                <img
                  className="img"
                  src="https://www.urbandart.com/images/udr/swag/4.jpg"
                  alt="img"
                />
                <img
                  className="img"
                  src="https://www.freemockupworld.com/wp-content/uploads/2020/09/Free-T-shirt-Mockup-01.jpg"
                  alt="img"
                />
                <img
                  className="img"
                  src="https://www.freemockupworld.com/wp-content/uploads/2020/09/Free-T-shirt-Mockup-01.jpg"
                  alt="img"
                />
                <img
                  className="img"
                  src="https://www.freemockupworld.com/wp-content/uploads/2020/09/Free-T-shirt-Mockup-01.jpg"
                  alt="img"
                />
                <img
                  className="img"
                  src="https://www.freemockupworld.com/wp-content/uploads/2020/09/Free-T-shirt-Mockup-01.jpg"
                  alt="img"
                />
                <img
                  className="img"
                  src="https://www.freemockupworld.com/wp-content/uploads/2020/09/Free-T-shirt-Mockup-01.jpg"
                  alt="img"
                />
              </Carousel>
            </div>
            <div className="w-[100vmin]">
              <div>
                <div className="detailsBlock-1">
                  <h2>{product.name}</h2>
                  <p>Product # {product._id}</p>
                </div>
                <div className="detailsBlock-2">
                  <ReactStar
                    edit={false}
                    color={"rgba(20, 20, 20, 0.1)"}
                    activeColor={"tomato"}
                    size={20}
                    value={Number(product.ratings)}
                    isHalf={true}
                  />
                  <span className="detailsBlock-2-span">
                    ({product.numOfReviews} Reviews)
                  </span>
                </div>
                <div className="detailsBlock-3">
                  <h1>{`PRK: ${product.price}`}</h1>
                  <div className="detailsBlock-3-1">
                    <div className="detailsBlock-3-1-1">
                      <button onClick={"decreaseQuantity"}>-</button>
                      <input readOnly type="number" value={"1"} />
                      <button onClick={"increaseQuantity"}>+</button>
                    </div>
                    <button
                      // disabled={product.Stock < 1 ? true : false}
                      onClick={"addToCartHandler"}
                    >
                      Add to Cart
                    </button>
                  </div>

                  <p>
                    Status: &nbsp;
                    <b
                      className={product.Stock < 1 ? "redColor" : "greenColor"}
                    >
                      {product.Stock < 1 ? "OutOfStock" : "InStock"}
                    </b>
                  </p>
                </div>

                <div className="detailsBlock-4">
                  Description : <p>{product.description}</p>
                </div>

                <button onClick={"submitReviewToggle"} className="submitReview">
                  Submit Review
                </button>
              </div>
            </div>
          </div>
          <div className="mt-24">
            <h3 className="reviewsHeading">REVIEWS</h3>
            {product.numOfReviews > 0 ? (
              <ProductsReviews review={product.reviews} />
            ) : (
              <p className="noReviews">No Reviews Yet</p>
            )}
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

export default ProductDetail;
