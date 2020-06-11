import React from "react";
import styled from "styled-components";
import gql from "graphql-tag";
import { ALL_ITEMS_QUERY } from "./Items";
import { useMutation } from "@apollo/client";

const DELETE_ITEM_MUTATION = gql`
  mutation DELETE_ITEM_MUTATION($id: ID!) {
    deleteItem(id: $id) {
      id
    }
  }
`;

export const DeleteItem = (props) => {
  const [deleteItem, { error }] = useMutation(DELETE_ITEM_MUTATION, {
    variables: { id: props.id },
    update: update,
  });
  const update = (cache, payload) => {
    // manually update the cache on the client, so it matches the server
    // 1 Read the cache for the items we want
    const data = cache.readQuery({ query: ALL_ITEMS_QUERY });
    console.log(data);
    // 2. filter the dleteted item out of the page
    data.items = data.items.filter(
      (item) => item.id !== payload.data.deleteItem.id
    );
    // 3. Put the items back
    cache.writeQuery({ query: ALL_ITEMS_QUERY, data: data });
  };

  return (
    <button
      onClick={async () => {
        if (confirm("Are you sure you want to delete this item?")) {
          await deleteItem();
        }
      }}
    >
      {props.children}
    </button>
  );
};

const Styled = styled.div``;
