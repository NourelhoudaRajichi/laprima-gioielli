import { gql } from "graphql-request";

// ─── AUTH ───────────────────────────────────────────────────────────────────────

export const LOGIN_USER = gql`
  mutation LoginUser($username: String!, $password: String!) {
    login(input: { username: $username, password: $password }) {
      authToken
      refreshToken
      user {
        id
        databaseId
        name
        email
      }
    }
  }
`;

export const REGISTER_USER = gql`
  mutation RegisterUser(
    $username: String!
    $email: String!
    $password: String!
    $firstName: String
    $lastName: String
  ) {
    registerUser(
      input: {
        username: $username
        email: $email
        password: $password
        firstName: $firstName
        lastName: $lastName
      }
    ) {
      user {
        id
        databaseId
        name
        email
      }
    }
  }
`;

export const REFRESH_TOKEN = gql`
  mutation RefreshToken($refreshToken: String!) {
    refreshJwtAuthToken(input: { jwtRefreshToken: $refreshToken }) {
      authToken
    }
  }
`;

// ─── NEWS POSTS ────────────────────────────────────────────────────────────────

export const GET_POSTS = gql`
  query GetPosts($first: Int = 20, $after: String) {
    posts(first: $first, after: $after, where: { status: PUBLISH }) {
      pageInfo {
        hasNextPage
        endCursor
      }
      nodes {
        id
        databaseId
        title
        slug
        date
        excerpt(format: RENDERED)
        content(format: RENDERED)
        featuredImage {
          node {
            sourceUrl
            altText
            mediaDetails {
              width
              height
            }
          }
        }
        categories {
          nodes {
            name
            slug
          }
        }
        author {
          node {
            name
          }
        }
      }
    }
  }
`;

export const GET_POST_BY_SLUG = gql`
  query GetPostBySlug($slug: ID!) {
    post(id: $slug, idType: SLUG) {
      id
      databaseId
      title
      slug
      date
      content(format: RENDERED)
      excerpt(format: RENDERED)
      featuredImage {
        node {
          sourceUrl
          altText
        }
      }
      categories {
        nodes {
          name
          slug
        }
      }
      author {
        node {
          name
          avatar {
            url
          }
        }
      }
    }
  }
`;

// ─── COLLECTIONS ───────────────────────────────────────────────────────────────
// Requires CPT "collection" registered in WordPress with show_in_graphql: true

export const GET_COLLECTIONS = gql`
  query GetCollections($first: Int = 20) {
    collections(first: $first) {
      nodes {
        id
        databaseId
        title
        slug
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
        collectionFields {
          subtitle
          description
          link
        }
      }
    }
  }
`;

export const GET_COLLECTION_BY_SLUG = gql`
  query GetCollectionBySlug($slug: ID!) {
    collection(id: $slug, idType: SLUG) {
      id
      title
      slug
      featuredImage {
        node {
          sourceUrl
          altText
        }
      }
      collectionFields {
        subtitle
        description
        link
      }
    }
  }
`;

// ─── PRODUCTS ──────────────────────────────────────────────────────────────────
// Requires CPT "product" registered in WordPress with show_in_graphql: true

export const GET_PRODUCTS = gql`
  query GetProducts($first: Int = 50) {
    products(first: $first) {
      nodes {
        id
        databaseId
        title
        slug
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
        productFields {
          price
          salePrice
          sku
          description
          collectionName
          material
          gallery {
            sourceUrl
            altText
          }
        }
      }
    }
  }
`;

export const GET_PRODUCTS_BY_COLLECTION = gql`
  query GetProductsByCollection($collection: String!, $first: Int = 50) {
    products(
      first: $first
      where: { metaQuery: { metaArray: [{ key: "collection_name", value: $collection }] } }
    ) {
      nodes {
        id
        databaseId
        title
        slug
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
        productFields {
          price
          salePrice
          sku
          description
          collectionName
          material
        }
      }
    }
  }
`;

export const GET_PRODUCT_BY_SLUG = gql`
  query GetProductBySlug($slug: ID!) {
    product(id: $slug, idType: SLUG) {
      id
      databaseId
      title
      slug
      featuredImage {
        node {
          sourceUrl
          altText
        }
      }
      productFields {
        price
        salePrice
        sku
        description
        collectionName
        material
        gallery {
          sourceUrl
          altText
        }
      }
    }
  }
`;
