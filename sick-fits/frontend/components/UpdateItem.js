import React, { useState } from "react";
import Form from "./styles/Form";
import formatMoney from "../lib/formatMoney";
import gql from "graphql-tag";
import DisplayError from "./ErrorMessage";
import { useQuery } from "@apollo/client";

const SINGLE_ITEM_QUERY = gql`
  query SINGLE_ITEM_QUERY($id: ID!) {
    item(where: { id: $id }) {
      id
      title
      description
      price
    }
  }
`;

export const UPDATE_ITEM_MUTATION = gql`
  mutation UPDATE_ITEM_MUTATION(
    $id: ID!
    $title: String
    $description: String
    $price: Int
  ) {
    updateItem(
      id: $id
      title: $title
      description: $description
      price: $price
    ) {
      id
      title
      description
      price
    }
  }
`;

export const UpdateItem = (props) => {
  const [state, setState] = useState({});
  const { queryLoading, queryError, data } = useQuery(SINGLE_ITEM_QUERY, {
    variables: { id: props.id },
  });

  const [updateItem, { mutationLoading, mutationError }] = useMutation(
    UPDATE_ITEM_MUTATION
  );

  const handleUpdateItem = async (e, updateItemMutation) => {
    // stop the form from submitting
    e.preventDefault();
    // call the mutation
    const res = await updateItemMutation({
      variables: {
        id: props.id,
        ...state,
      },
    });
  };

  const handleChange = (e) => {
    const { name, type, value } = e.target;
    const val = type === "number" ? parseFloat(value) : value;
    setState({ ...state, [name]: val });
  };

  if (queryLoading) return <p>Loading...</p>;
  if (!data.item) return <p> No Item Found for id {props.id}</p>;

  return (
    <Form onSubmit={(e) => handleUpdateItem(e, updateItem)}>
      <DisplayError error={mutationError} />
      <fieldset disabled={mutationLoading} aria-busy={mutationLoading}>
        <label htmlFor="title">
          Title
          <input
            type="text"
            id="title"
            name="title"
            placeholder="Title"
            required
            defaultValue={data.item.title}
            onChange={handleChange}
          />
        </label>

        <label htmlFor="price">
          Price
          <input
            type="number"
            id="price"
            name="price"
            placeholder="Price"
            required
            defaultValue={data.item.price}
            onChange={handleChange}
          />
        </label>

        <label htmlFor="description">
          Description
          <textarea
            id="description"
            name="description"
            placeholder="Enter a description"
            required
            defaultValue={data.item.description}
            onChange={handleChange}
          />
        </label>
        <button type="submit">
          Sav {mutationLoading ? "ing" : "e"} Changes
        </button>
      </fieldset>
    </Form>
  );
};
