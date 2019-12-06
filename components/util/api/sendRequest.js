import "isomorphic-unfetch";

const port = process.env.PORT || 3000;
const ROOT_URL = process.env.ROOT_URL || `http://localhost:${port}`;

export default async function sendRequest(path, opts = {}) {
  // define headers
  const headers = Object.assign({}, opts.headers || {}, {
    "Content-type": "application/json; charset-UTF-8"
  });

  // fetch data
  // fetch method: fetch(url, options).then().catch();
  // fetch options: method, body, headers, credentials
  const response = await fetch(
    `${ROOT_URL}${path}`,
    Object.assign({ method: "POST", credentials: "same-origin" }, opts, {
      headers
    })
  );

  const data = await response.json();

  if (data.error) {
    throw new Error(data.error);
  }

  return data;
}
