import React, { Component } from 'react';
import renderHTML from 'react-render-html';

class ShowArticle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      articleHTML: null,
    };
  }

  render() {
    return (
      <div id="articleContent">
        {this.state.articleHTML === null ? undefined : renderHTML(this.state.articleHTML)}
      </div>
    );
  }
}

export default ShowArticle;
