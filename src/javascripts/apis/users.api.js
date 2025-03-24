import { baseUrl } from "../const.js";

async function getUsers() {
  try {
    const response = await fetch(baseUrl);

    const data = await response.json();

    return data.users;
  } catch (error) {
    console.error("Get Users Failed: ", error);
  }
}

export { getUsers };