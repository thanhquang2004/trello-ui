/* eslint-disable no-undef */
// export const API_ROOT = "http://localhost:8080";
let apiRoot = "";

if (process.env.BUILD_MODE === "dev") {
  apiRoot = "http://localhost:8080";
}

if (process.env.BUILD_MODE === "production") {
  apiRoot = "https://trello-api-hg29.onrender.com";
}

export const API_ROOT = apiRoot;
