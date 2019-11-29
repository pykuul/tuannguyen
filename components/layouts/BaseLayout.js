import Head from "next/head";
// import shared components
import Header from "../layouts/Header";

const BaseLayout = props => {
  return (
    <>
      <Head>
        <title>{props.title}</title>
        <meta name="description" content={props.description} />
      </Head>
      <Header />
      {props.children}
    </>
  );
};

export default BaseLayout;
