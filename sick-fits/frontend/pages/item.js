import { Items } from "../components/Items";
import React from "react";
import { SingleItem } from "../components/SingleItem";
import { gql } from "graphql-tag";

const Item = (props) => {
  return (
    <div>
      <SingleItem id={props.query.id} />
    </div>
  );
};

export default Item;
