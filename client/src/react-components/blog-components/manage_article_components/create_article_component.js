import React, { Component } from 'react';
import { Line } from 'rc-progress';
import axios from 'axios';
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import MyUploadAdapter from './uploadAdapter';
import ArticleElement from '../article_element_component';
import notificators from '../../layout-components/notification-components/notificators';
import '../../../../public/stylesheets/react_component_stylesheets/blog/create_article.css';
import '../../../../public/stylesheets/react_component_stylesheets/blog/ckeditor.css';
import '../../../../public/stylesheets/react_component_stylesheets/blog/file_input.css';

function MyCustomUploadAdapterPlugin(editor) {
  const _editor = editor;
  _editor.plugins.get('FileRepository').createUploadAdapter = function load(loader) {
    return new MyUploadAdapter(loader);
  };
}

class CreateArticle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listOfTopics: [],
      title: null,
      topic: null,
      preViewContent: null,
      content: null,
      articleImagePreviewUrl: null,
      articleImageFile: null,
      uploadProgress: null,
    };
    this.handleTitleTyping = this.handleTitleTyping.bind(this);
    this.handleTopicChange = this.handleTopicChange.bind(this);
    this.handlePreViewContentChange = this.handlePreViewContentChange.bind(this);
    this.handleImgUpload = this.handleImgUpload.bind(this);
    this.verifyFields = this.verifyFields.bind(this);
    this.handleArticleCreate = this.handleArticleCreate.bind(this);
    this.uploadConfig = {
      onUploadProgress: (progressEvent) => {
        const percentCompleted = (Math.round((progressEvent.loaded * 100) / progressEvent.total)) * 0.8;
        this.setState({
          uploadProgress: percentCompleted,
        });
      },
    };
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

  handlePreViewContentChange(event) {
    this.setState({
      preViewContent: event.target.value,
    });
  }

  createTopicOptions() {
    return this.state.listOfTopics.map(item => <option value={item}>{item}</option>);
  }

  handleImgUpload(event) {
    const reader = new FileReader();
    const file = event.target.files[0];
    reader.onloadend = () => {
      this.setState({
        articleImageFile: file,
        articleImagePreviewUrl: reader.result,
      });
    };
    reader.readAsDataURL(file);
  }

  verifyFields(callback) {
    const titleNotEmpty = this.state.title !== null;
    const topicNotEmpty = this.state.topic !== null;
    const preViewContentNotEmpty = this.state.preViewContent !== null;
    const articleImgIsLoaded = this.state.articleImageFile !== null;
    const contentNotEmpty = this.state.content !== null;
    switch (false) {
      case titleNotEmpty:
        return callback(new Error('Title field is empty'));
      case topicNotEmpty:
        return callback(new Error('Topic field is empty'));
      case preViewContentNotEmpty:
        return callback(new Error('Preview content field is empty'));
      case articleImgIsLoaded:
        return callback(new Error('Article image not loaded'));
      case contentNotEmpty:
        return callback(new Error('Content field is empty'));
      default:
        return callback();
    }
  }

  handleArticleCreate() {
    this.verifyFields((err) => {
      if (err) {
        notificators.mainNotificator.showError(err.message);
      } else {
        const formData = new FormData();
        formData.append('file', this.state.articleImageFile);
        formData.append('title', this.state.title);
        formData.append('topic', this.state.topic);
        formData.append('preViewContent', this.state.preViewContent);
        formData.append('content', this.state.content);
        axios.post('/blog_api/article', formData, this.uploadConfig)
          .then(() => {
            this.setState({
              uploadProgress: 100,
            });
            window.location.href = '/';
          })
          .catch((error) => {
            this.setState({
              uploadProgress: null,
            });
            notificators.mainNotificator.showError(error.response.data.error);
          });
      }
    });
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
        <label htmlFor="articleImage">
          {'Картинка статьи'}
          <div className="form-group file-area">
            <input onChange={this.handleImgUpload} type="file" name="images" id="images" required="required" multiple="multiple" />
            <div className="file-dummy">
              <div className="success">Great, your files are selected. Keep on.</div>
              <div className="default">Please select some files</div>
            </div>
          </div>
        </label>
        <label htmlFor="preViewContent">
          {'Контент для предпросмотра'}
          <br />
          <textarea id="preViewContent" value={this.state.preViewContent} onChange={this.handlePreViewContentChange} />
        </label>
        <ArticleElement articleImageFile={this.state.articleImagePreviewUrl} title={this.state.title} preViewContent={this.state.preViewContent} topic={this.state.topic} />
        {'Контент статьи'}
        <br />
        <CKEditor
          editor={ClassicEditor}
          config={{
            extraPlugins: [MyCustomUploadAdapterPlugin],
          }}
          onChange={(event, editor) => {
            const data = editor.getData();
            this.setState({
              content: data,
            });
          }}
        />
        <button id="createArticleButton" className="clickable" type="button" onClick={this.handleArticleCreate}>Создать статью</button>
        <Line className={this.state.uploadProgress === null ? 'hiddenElement' : ''} id="progressBar" percent={this.state.uploadProgress} strokeWidth="1" strokeColor="#0077ff" />
      </div>
    );
  }
}

export default CreateArticle;
