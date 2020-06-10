import React, { useState } from "react";
import styled from "styled-components";
import { Mutation } from "react-apollo";
import Form from "./styles/Form";
import formatMoney from "../lib/formatMoney";
import gql from "graphql-tag";
import DisplayError from "./ErrorMessage";
import Router from "next/router";

export const CREATE_ITEM_MUTATION = gql`
  mutation CREATE_ITEM_MUTATION(
    $title: String!
    $description: String!
    $price: Int!
    $image: String
    $largeImage: String
  ) {
    createItem(
      title: $title
      description: $description
      price: $price
      image: $image
      largeImage: $largeImage
    ) {
      id
    }
  }
`;

export const CreateItem = (props) => {
  const [state, setState] = useState({
    title: "",
    description: "",
    image: "",
    largeImage: "",
    price: 0,
  });

  const handleChange = (e) => {
    const { name, type, value } = e.target;
    const val = type === "number" ? parseFloat(value) : value;
    setState({ ...state, [name]: val });
  };

  const uploadFile = async (e) => {
    console.log("uploading file...");
    const files = e.target.files;
    const data = new FormData();
    data.append("file", files[0]);
    data.append("upload_preset", "sickfits");
    const res = await fetch(
      "https://api.cloudinary.com/v1_1/qualityfoodrecipes/image/upload",
      {
        method: "POST",
        body: data,
      }
    );
    const file = await res.json();
    console.log(file);
    setState({
      ...state,
      image: file.secure_url,
      largeImage: file.eager[0].secure_url,
    });
  };

  return (
    <Mutation mutation={CREATE_ITEM_MUTATION} variables={state}>
      {(createItem, { loading, error }) => (
        <Form
          onSubmit={async (e) => {
            // stop the form from submitting
            e.preventDefault();
            // call the mutation
            const res = await createItem();
            // change them to the single item page
            Router.push({
              pathname: "/item",
              query: { id: res.data.createItem.id },
            });
            console.log(res);
          }}
        >
          <DisplayError error={error} />
          <fieldset disabled={loading} aria-busy={loading}>
            <label htmlFor="file">
              Image
              <input
                type="file"
                id="file"
                name="file"
                placeholder="Upload an image"
                required
                onChange={uploadFile}
              />
              {state.image && <img src={state.image} alt="Upload Preview" />}
            </label>
            <label htmlFor="title">
              Title
              <input
                type="text"
                id="title"
                name="title"
                placeholder="Title"
                required
                value={state.title}
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
                value={state.price}
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
                value={state.description}
                onChange={handleChange}
              />
            </label>
            <button type="submit">Submit</button>
          </fieldset>
        </Form>
      )}
    </Mutation>
  );
};

const Styled = styled.div``;
