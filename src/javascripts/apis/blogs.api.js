import { baseUrl } from "../const.js";

async function getBlogs() {
  try {
    const response = await fetch(baseUrl);

    const data = await response.json();

    return data.blogs;
  } catch (error) {
    console.error("Get Blogs Failed: ", error);
  }
}

export { getBlogs };