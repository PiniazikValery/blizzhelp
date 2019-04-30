import React, { Component } from 'react';
import '../../../public/stylesheets/react_component_stylesheets/blog/article_element.css';

class ArticleElement extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasImage: this.props.articleImage !== null && this.props.articleImage !== undefined,
    };
  }

  getImageOfArticle() {
    let result = null;
    if (this.props.articleImageFile === null || this.props.articleImageFile === undefined) {
      if (this.state.hasImage) {
        result = <img alt="HTML5 Icon" src={`/blog_api/article_image/${this.props.articleId}`} className="article_image" />;
      } else {
        result = <img alt="HTML5 Icon" src="/images/icons/blog/image_not_found.png" className="article_image" />;
      }
    } else {
      result = <img alt="HTML5 Icon" src={this.props.articleImageFile} className="article_image" />;
    }
    return result;
  }

  render() {
    return (
      <div className="articleElement" role="button" tabIndex="0" onClick={() => { window.location.href = `/article/showArticle/${this.props.articleId}`; }} onKeyDown={() => { window.location.href = `/article/showArticle/${this.props.articleId}`; }}>
        { this.getImageOfArticle() }
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
