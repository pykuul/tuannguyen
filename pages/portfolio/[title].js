import React, { Component } from 'react';
import { withRouter } from 'next/router';
// import components
import BaseLayout from '../../components/layouts/BaseLayout';

class Portfolio extends Component {

  render() {
    // debugger;
    let title = this.props.router.query.title;

    const titleRender = title ? (
      <>
        <h1>{title.split('-').join(' ')}</h1>
        <p>This is the post content.</p>
      </>
    ) : (<h2>loading ... </h2>)
  
    return (
      <BaseLayout>
        {titleRender}
      </BaseLayout>
    ) 
  }
}

export default withRouter(Portfolio);