import React, { Component } from "react";
import axios from "axios";
import Link from "next/link";
// import components
import BaseLayout from "../components/layouts/BaseLayout";

class Portfolios extends Component {
  static async getInitialProps() {
    // fetch data
    let posts = [];

    try {
      const response = await axios.get(
        "https://jsonplaceholder.typicode.com/posts"
      );
      posts = response.data;
    } catch (err) {
      console.error(err);
    }

    return { posts: posts.splice(0, 10) };
  }

  renderPost(posts) {
    return posts.map(post => {
      let title = post.title.split(" ").join("-");

      return (
        <li key={post.id}>
          {/* if use with [title] */}
          {/* <Link href="/portfolio/[title]" as={`/portfolio/${title}`}> */}
          <Link href={`/portfolio?title=${title}`} as={`/portfolio/${title}`}>
            <a>{post.title}</a>
          </Link>
        </li>
      );
    });
  }

  render() {
    const { posts } = this.props;

    return (
      <BaseLayout>
        <h1>I am Portfolios Page</h1>
        <ul>{this.renderPost(posts)}</ul>
      </BaseLayout>
    );
  }
}

export default Portfolios;
