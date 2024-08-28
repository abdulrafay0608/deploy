import React, { Fragment, useEffect, useState } from "react";
import "./Home.css";
import ProductCard from "../Products/ProductCard";
import MetaData from "../Layout/MetaData";
import { useDispatch, useSelector } from "react-redux";
import { clearError, fetchProducts } from "../../features/productSlice";
import Loader from "../Loader/Loader";
import { useParams } from "react-router-dom";
import ResponsivePagination from "react-responsive-pagination";
import "react-responsive-pagination/themes/classic.css";

const Home = () => {
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
  }, [dispatch, keyword, currentPage]);

  const totalPages = Math.ceil(productCount / perPage);

  return (
    <Fragment>
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          <MetaData title={"Home - Ecommerce"} />
          <div className="banner">
            <p>Welcome to Ecommerce</p>
            <h1>FIND AMAZING PRODUCTS BELOW</h1>
            <a href="#container">
              <button>Scroll</button>
            </a>
          </div>
          <h2 id="container" className="homeHeading">
            Featured Products
          </h2>
          <div className="container">
            {products &&
              products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
          </div>
        </Fragment>
      )}
      {productCount > 8 && (
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

export default Home;
