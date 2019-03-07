import React, { Component } from 'react';
import '../../../public/stylesheets/react_component_stylesheets/blog/article_element.css';

class ArticleElement extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasImage: this.props.articleImage !== null,
    };
  }

  render() {
    return (
      <div className="articleElement">
        {this.state.hasImage ? <img alt="HTML5 Icon" src={`/blog_api/article_image/${this.props.articleId}`} className="article_image" /> : <img alt="HTML5 Icon" src="/images/icons/blog/image_not_found.png" className="article_image" />}
        <div className="articleInfo">
          <span className="title">{this.props.title}</span>
          <span className="preViewContent">{this.props.preViewContent}</span>
          <span className="topic">{this.props.topic}</span>
        </div>
      </div>
    );
  }
}

export default ArticleElement;
