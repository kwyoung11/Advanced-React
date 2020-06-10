import React, { useState } from "react";
import styled from "styled-components";
import { Mutation, Query } from "react-apollo";
import Form from "./styles/Form";
import formatMoney from "../lib/formatMoney";
import gql from "graphql-tag";
import DisplayError from "./ErrorMessage";
import Router from "next/router";

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
  console.log("ui", { props });
  const handleUpdateItem = async (e, updateItemMutation) => {
    // stop the form from submitting
    console.log("test", {
      id: props.id,
      ...state,
    });
    e.preventDefault();
    // call the mutation
    const res = await updateItemMutation({
      variables: {
        id: props.id,
        ...state,
      },
    });
    // change them to the single item page
    // Router.push({
    //   pathname: "/item",
    //   query: { id: res.data.updateItem.id },
    // });
    console.log(res);
  };

  const handleChange = (e) => {
    const { name, type, value } = e.target;
    const val = type === "number" ? parseFloat(value) : value;
    setState({ ...state, [name]: val });
  };

  return (
    <Query query={SINGLE_ITEM_QUERY} variables={{ id: props.id }}>
      {({ data, loading }) => {
        if (loading) return <p>Loading...</p>;
        if (!data.item) return <p> No Item Found for id {props.id}</p>;
        return (
          <Mutation mutation={UPDATE_ITEM_MUTATION} variables={state}>
            {(updateItem, { loading, error }) => (
              <Form onSubmit={(e) => handleUpdateItem(e, updateItem)}>
                <DisplayError error={error} />
                <fieldset disabled={loading} aria-busy={loading}>
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
                    Sav ${loading ? "ing" : "e"} Changes
                  </button>
                </fieldset>
              </Form>
            )}
          </Mutation>
        );
      }}
    </Query>
  );
};
