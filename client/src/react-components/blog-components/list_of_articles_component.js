import React, { Component } from 'react';
import ReactPaginate from 'react-paginate';
import ArticleElement from './article_element_component';
import '../../../public/stylesheets/react-paginate/react-paginate.css';

class ListOfArticles extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listOfArticles: [],
      countOfPages: 1,
      initialPage: 0,
      componentLoaded: false,
    };
    this.getPaginate = this.getPaginate.bind(this);
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
        this.setState({
          listOfArticles: JSON.parse(JSON.stringify(result.docs)),
          countOfPages: result.pages,
          initialPage: result.page - 1,
          componentLoaded: true,
        });
      });
  }

  getPaginate() {
    switch (this.state.componentLoaded) {
      case true:
        return (
          <div id="react-paginate">
            <ReactPaginate
              disableInitialCallback="true"
              initialPage={this.state.initialPage}
              nextClassName="next_button"
              previousClassName="previous_button"
              pageCount={this.state.countOfPages}
              marginPagesDisplayed={2}
              pageRangeDisplayed={5}
              onPageChange={(data) => { window.location.href = `/article/page=${data.selected + 1}&topic=${this.props.topic}`; }}
            />
          </div>
        );
      default:
        return undefined;
    }
  }

  render() {
    return (
      <div>
        { this.state.listOfArticles.map(element => <ArticleElement articleId={element._id} title={element.title} preViewContent={element.preViewContent} topic={element.topic} articleImage={element.article_image} />) }
        { this.getPaginate() }
      </div>
    );
  }
}

export default ListOfArticles;
