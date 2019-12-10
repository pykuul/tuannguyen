import "isomorphic-unfetch";

const dev = process.env.NODE_ENV !== "production";
const port = process.env.PORT || 3000;
const ROOT_URL = dev
  ? `http://localhost:${port}`
  : "https://richardnguyen.herokuapp.com";

export default async function sendRequest(path, options = {}) {
  // define headers
  const headers = Object.assign({}, options.headers || {}, {
    "Content-type": "application/json; charset-UTF-8"
  });

  // fetch data
  // fetch method: fetch(url, options).then().catch();
  // fetch options: method, body, headers, credentials
  const response = await fetch(
    `${ROOT_URL}${path}`,
    Object.assign({ method: "POST", credentials: "include" }, options, {
      headers
    })
  );

  const data = await response.json();

  if (data.error) {
    throw new Error(data.error);
  }
  // console.log(`DATA RECIEVED: ${data}`);
  return data;
}
