import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Search = () => {
  const [value, setValue] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (value.trim()) {
      navigate(`/products/${value}`);
    } else {
      navigate(`/products`);
    }
  };

  return (
    <div className="absolute h-[30vh] w-full bg-white">
      <div className="flex justify-center items-center h-full">
        <div className="border ">
          <form onSubmit={handleSearch}>
            <input
              className="p-4 outline-none w-[80vmin] rounded-xl"
              type="search"
              placeholder="Search"
              value={value}
              onChange={(e) => {
                setValue(e.target.value);
              }}
            />
            <button className="p-4 px-8 bg-slate-500">Search</button>
          </form>
        </div>
        <span>
          <Link className="p-4" to={"/"}>
            X
          </Link>
        </span>
      </div>
    </div>
  );
};

export default Search;
