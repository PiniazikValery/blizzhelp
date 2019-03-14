import React, { Component } from 'react';
import '../../../../public/stylesheets/react_component_stylesheets/blog/create_article.css';

class CreateArticle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: null,
      listOfTopics: [],
      topic: null,
    };
    this.handleTitleTyping = this.handleTitleTyping.bind(this);
    this.handleTopicChange = this.handleTopicChange.bind(this);
  }

  componentDidMount() {
    fetch('/blog_api/avaliable_topics', {
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
          listOfTopics: result,
          topic: result[0],
        });
      });
  }

  handleTopicChange(event) {
    this.setState({
      topic: event.target.value,
    });
  }

  handleTitleTyping(event) {
    this.setState({
      title: event.target.value,
    });
  }

  createTopicOptions() {
    return this.state.listOfTopics.map(item => <option value={item}>{item}</option>);
  }

  render() {
    return (
      <div id="createArticleForm">
        <label htmlFor="titleInput">
          {'Название статьи'}
          <br />
          <input id="titleInput" value={this.state.title} onChange={this.handleTitleTyping} />
        </label>
        <br />
        <label htmlFor="topic">
          {'Тема статьи'}
          <div className="select">
            <select id="topic" value={this.state.topic} onChange={this.handleTopicChange}>
              {this.createTopicOptions()}
            </select>
          </div>
        </label>
      </div>
    );
  }
}

export default CreateArticle;
