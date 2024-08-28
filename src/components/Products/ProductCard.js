import React from "react";
import { Link } from "react-router-dom";
import ReactStar from "react-rating-stars-component";

const ProductCard = ({ product }) => {
  // const products = {
  //   name: "T-Stirt",
  //   description: "lorem lorem lorem lorem lorem lorem ",
  //   price: "15",
  //   category: "men",
  //   images: [
  //     {
  //       url: "https://media.istockphoto.com/id/1260550390/photo/t-shirt-mockup-on-wooden-hanger.webp?b=1&s=170667a&w=0&k=20&c=wryv7s3MScUR7Cq1WcvfFMdoQ6-9hEsAzbxwRokSmWg=",
  //     },
  //   ],
  //   _id: "09876543211234567890",
  // };

  const option = {
    edit: false,
    color: "rgba(20,20,20,0.1)",
    activeColor: "tomato",
    size: window.innerWidth < 600 ? 25 : 20,
    value: product.ratings,
    isHalf: true,
  };
  return (
    <Link className="productCard border border-gray-100" to={`/product-detail/${product._id}`}>
      <img
        className=""
        src={
          "https://media.istockphoto.com/id/1260550390/photo/t-shirt-mockup-on-wooden-hanger.webp?b=1&s=170667a&w=0&k=20&c=wryv7s3MScUR7Cq1WcvfFMdoQ6-9hEsAzbxwRokSmWg="
        }
        alt={product.name}
      />
      <p className="">{product.name}</p>
      <div>
        <ReactStar {...option} /> <span>({product.numOfReviews} Reviews)</span>
      </div>
      <span> Price: {product.price}</span>
    </Link>
  );
};

export default ProductCard;
