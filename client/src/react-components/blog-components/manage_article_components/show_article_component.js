import React, { Component } from 'react';
import renderHTML from 'react-render-html';
import '../../../../public/stylesheets/react_component_stylesheets/blog/fullArticle.css';

class ShowArticle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      articleHTML: null,
    };
  }

  componentDidMount() {
    fetch(`/blog_api/article_content/${this.props.articleid}`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then(res => res.json())
      .then((result) => {
        this.setState({
          articleHTML: result.content,
        });
      });
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
