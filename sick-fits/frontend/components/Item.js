import React from "react";
import styled from "styled-components";
import Title from "./styles/Title";
import ItemStyles from "./styles/ItemStyles";
import PriceTag from "./styles/PriceTag";
import Link from "next/link";
import formatMoney from "../lib/formatMoney";

export const Item = ({ item }) => {
  return (
    <ItemStyles>
      {item.image && <img src={item.image} alt={item.title} />}
      <Title>
        <Link
          href={{
            pathname: "/item",
            query: { id: item.id },
          }}
        >
          <a>{item.title}</a>
        </Link>
      </Title>
      <PriceTag>{formatMoney(item.price)}</PriceTag>
      <p>{item.description}</p>
      <div className="buttonList">
        <Link
          href={{
            pathname: "update",
            query: { id: item.id },
          }}
        >
          <a>Edit 📝</a>
        </Link>
        <button>Add to Cart</button>
        <button>Delete</button>
      </div>
    </ItemStyles>
  );
};
