import React from "react";
import "react-multi-carousel/lib/styles.css";
import Carousel from "react-multi-carousel";
import ReactStar from "react-rating-stars-component";

const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 3,
    slidesToSlide: 3, // optional, default to 1.
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 2,
    slidesToSlide: 2, // optional, default to 1.
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
    slidesToSlide: 1, // optional, default to 1.
  },
};

const ProductsReviews = ({ review }) => {
  return (
    <div>
      <Carousel
        responsive={responsive}
        infinite={true}
        autoPlay={true}
        autoPlaySpeed={1000}
        keyBoardControl={true}
        customTransition="all .5"
        transitionDuration={500}
        containerClass="carousel-container"
      >
        {review &&
          review.map((e) => {
            console.log(e);
            return (
              <div className="reviewCard ">
                {/* <img src={profilePng} alt="User" />  */}
                <p>{e.name}</p>
                <ReactStar
                  edit={false}
                  color={"rgba(20, 20, 20, 0.1)"}
                  activeColor={"tomato"}
                  size={20}
                  value={Number(e.rating)}
                  isHalf={true}
                />
                <span className="reviewCardComment">{e.comment}</span>
              </div>
            );
          })}
      </Carousel>
    </div>
  );
};

export default ProductsReviews;
