import React from "react";
import styled from "styled-components";
import PaginationStyles from "./styles/PaginationStyles";
import { perPage } from "../config";
import gql from "graphql-tag";
import Head from "next/head";
import Link from "next/link";
import { useQuery } from "@apollo/client";

const PAGINATION_QUERY = gql`
  query PAGINATION_QUERY {
    itemsConnection {
      aggregate {
        count
      }
    }
  }
`;

export const Pagination = (props) => {
  const { loading, error, data } = useQuery(PAGINATION_QUERY);

  if (loading) return <p>Loading...</p>;

  if (error) return <Error error={error} />;

  const count = data.itemsConnection.aggregate.count;
  const pages = Math.ceil(count / perPage);
  const page = props.page;

  return (
    <PaginationStyles>
      <Head>
        <title>
          Sick Fits! Page {page} of {page}
        </title>
      </Head>
      <Link
        href={{
          pathname: "/items",
          query: { page: page - 1 },
        }}
      >
        <a className="prev" aria-disabled={page <= 1}>
          Prev
        </a>
      </Link>
      <p>
        Page {props.page} of {pages}
      </p>
      <p>{count} Items Total</p>
      <Link
        href={{
          pathname: "/items",
          query: { page: page + 1 },
        }}
      >
        <a aria-disabled={page >= pages}>Next</a>
      </Link>
    </PaginationStyles>
  );
};
