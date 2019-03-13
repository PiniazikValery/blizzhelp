import React, { Component } from 'react';

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
        <input id="titleInput" value={this.state.title} onChange={this.handleTitleTyping} />
        <p />
        <select id="topics" value={this.state.topic} onChange={this.handleTopicChange}>
          {this.createTopicOptions()}
        </select>
      </div>
    );
  }
}

export default CreateArticle;
