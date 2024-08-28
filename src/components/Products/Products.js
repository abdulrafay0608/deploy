import React, { Fragment, useEffect, useState } from "react";
import Loader from "../Loader/Loader";
import MetaData from "../Layout/MetaData";
import { useDispatch, useSelector } from "react-redux";
import ProductCard from "./ProductCard";
import { clearError, fetchProducts } from "../../features/productSlice";
import { useParams } from "react-router-dom";
import ResponsivePagination from "react-responsive-pagination";
import "react-responsive-pagination/themes/classic.css";

export const Products = () => {
  const { keyword } = useParams();
  const [currentPage, setCurrentPage] = useState(1);

  const dispatch = useDispatch();

  const { products, loading, error, perPage, productCount } = useSelector(
    (state) => state.products
  );

  useEffect(() => {
    dispatch(fetchProducts({ keyword: keyword || "", currentPage }));

    return () => {
      dispatch(clearError());
    };
    // eslint-disable-next-line
  }, [dispatch, keyword, currentPage]);

  const totalPages = Math.ceil(productCount / perPage);

  return (
    <Fragment>
      <div>
        {loading ? (
          <Loader />
        ) : (
          <Fragment>
            <MetaData title={"Products - Ecommerce"} />
            <h2 className="homeHeading">Featured Products</h2>
            <div className="container" id="container">
              {products
                ? products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))
                : "Product not Found"}
            </div>
          </Fragment>
        )}
      </div>
      {productCount > perPage && (
        <div className="pagination-container">
          <ResponsivePagination
            current={currentPage}
            total={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </Fragment>
  );
};
