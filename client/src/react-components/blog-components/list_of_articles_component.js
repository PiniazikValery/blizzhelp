import React, { Component } from 'react';
import ArticleElement from './article_element_component';

class ListOfArticles extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listOfArticles: [],
    };
  }

  componentDidMount() {
    fetch(`/blog_api/articles/page=${this.props.pagenumber}&topic=${this.props.topic}`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    })
      .then(res => res.json())
      .then((result) => {
        this.setState({ listOfArticles: JSON.parse(JSON.stringify(result.docs)) });
      });
  }

  render() {
    return (
      this.state.listOfArticles.map(element => <ArticleElement articleId={element._id} title={element.title} preViewContent={element.preViewContent} topic={element.topic} articleImage={element.article_image} />)
    );
  }
}

export default ListOfArticles;
