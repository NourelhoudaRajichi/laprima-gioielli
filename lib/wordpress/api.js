import { fetchWP } from "./client";
import {
  GET_POSTS,
  GET_POST_BY_SLUG,
  GET_COLLECTIONS,
  GET_COLLECTION_BY_SLUG,
  GET_PRODUCTS,
  GET_PRODUCTS_BY_COLLECTION,
  GET_PRODUCT_BY_SLUG,
} from "./queries";

// ─── AUTH (WordPress REST API — no extra plugin needed) ─────────────────────────

const WP_BASE_URL = process.env.NEXT_PUBLIC_WP_GRAPHQL_URL?.replace("/graphql", "") ?? "";

export async function loginUser(username, password) {
  // Requires "JWT Authentication for WP REST API" plugin OR Application Passwords
  // Falls back to /wp-json/jwt-auth/v1/token if plugin is installed,
  // otherwise use WP Application Passwords via Basic Auth
  const res = await fetch(`${WP_BASE_URL}/wp-json/jwt-auth/v1/token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.message || "Login failed. Check your credentials.");
  }

  const data = await res.json();
  const user = { name: data.user_display_name, email: data.user_email, nicename: data.user_nicename };

  if (typeof window !== "undefined") {
    localStorage.setItem("wp_auth_token", data.token);
    localStorage.setItem("wp_user", JSON.stringify(user));
  }

  return { authToken: data.token, user };
}

export async function registerUser({ username, email, password, firstName, lastName }) {
  const res = await fetch("/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password, firstName, lastName }),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data?.error || "Registration failed.");
  }

  return data;
}

export function getStoredUser() {
  if (typeof window === "undefined") return null;
  try {
    return JSON.parse(localStorage.getItem("wp_user"));
  } catch {
    return null;
  }
}

export function logoutUser() {
  if (typeof window === "undefined") return;
  localStorage.removeItem("wp_auth_token");
  localStorage.removeItem("wp_user");
}

export function getAuthHeaders() {
  if (typeof window === "undefined") return {};
  const token = localStorage.getItem("wp_auth_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// ─── NEWS ───────────────────────────────────────────────────────────────────────

export async function getPosts(first = 20, after = null) {
  const data = await fetchWP(GET_POSTS, { first, after });
  return data.posts;
}

export async function getPostBySlug(slug) {
  const data = await fetchWP(GET_POST_BY_SLUG, { slug });
  return data.post;
}

// ─── COLLECTIONS ────────────────────────────────────────────────────────────────

export async function getCollections(first = 20) {
  const data = await fetchWP(GET_COLLECTIONS, { first });
  return data.collections.nodes;
}

export async function getCollectionBySlug(slug) {
  const data = await fetchWP(GET_COLLECTION_BY_SLUG, { slug });
  return data.collection;
}

// ─── PRODUCTS ───────────────────────────────────────────────────────────────────

export async function getProducts(first = 50) {
  const data = await fetchWP(GET_PRODUCTS, { first });
  return data.products.nodes;
}

export async function getProductsByCollection(collection, first = 50) {
  const data = await fetchWP(GET_PRODUCTS_BY_COLLECTION, { collection, first });
  return data.products.nodes;
}

export async function getProductBySlug(slug) {
  const data = await fetchWP(GET_PRODUCT_BY_SLUG, { slug });
  return data.product;
}
