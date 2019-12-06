import Head from "next/head";
// import components

const About = () => {
  return (
    <div style={{ textAlign: "center", margin: "0 20px" }}>
      <Head>
        <title>About page</title>
        <meta name="description" content="this is about page" />
      </Head>
      <br />
      <p>this is About Page</p>
    </div>
  );
};

export default About;
