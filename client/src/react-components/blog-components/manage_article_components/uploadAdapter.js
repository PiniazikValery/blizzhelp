class UploadAdapter {
  constructor(loader) {
    this.loader = loader;
  }

  upload() {
    return this.loader.file
      .then(file => new Promise((resolve, reject) => {
        this._initRequest();
        this._initListeners(resolve, reject, file);
        this._sendRequest(file);
      }));
  }

  abort() {
    if (this.xhr) {
      this.xhr.abort();
    }
  }

  _initRequest() {
    this.xhr = new XMLHttpRequest();

    this.xhr.open('POST', '/blog_api/uploadBlogImg', true);
    this.xhr.responseType = 'json';
  }

  _initListeners(resolve, reject, file) {
    const genericErrorText = `Couldn't upload file: ${file.name}.`;

    this.xhr.addEventListener('error', () => reject(genericErrorText));
    this.xhr.addEventListener('abort', () => reject());
    this.xhr.addEventListener('load', () => {
      if (!this.xhr.response || this.xhr.response.error) {
        return reject(this.xhr.response && this.xhr.response.error ? this.xhr.response.error.message : genericErrorText);
      }

      return resolve({
        default: this.xhr.response.url,
      });
    });

    if (this.xhr.upload) {
      this.xhr.upload.addEventListener('progress', (evt) => {
        if (evt.lengthComputable) {
          this.loader.uploadTotal = evt.total;
          this.loader.uploaded = evt.loaded;
        }
      });
    }
  }

  _sendRequest(file) {
    const data = new FormData();

    data.append('file', file);

    this.xhr.send(data);
  }
}

export default UploadAdapter;
