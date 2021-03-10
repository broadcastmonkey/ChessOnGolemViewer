import React from "react";

const SearchBox = ({ value, onChange, placeHolderValue }) => {
  return (
    <input
      type="text"
      name="query"
      className="form-control my-3"
      placeholder={placeHolderValue || "Search..."}
      value={value}
      onChange={(e) => onChange(e.currentTarget.value)}
    />
  );
};

export default SearchBox;
