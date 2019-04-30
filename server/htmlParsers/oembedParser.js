import { parse } from 'node-html-parser';
import youtubeUrl from 'youtube-url';

class OembedParser {
  constructor() {
    this.parser = null;
    this.youTubeId = false;
  }

  parseOembeds(html) {
    this.parser = parse(html);
    this.parser.querySelectorAll('oembed').map(element => element.set_content(this.getOembedContent(element.rawAttributes.url)));
    return this.parser.toString();
  }

  getOembedContent(url) {
    this.youTubeId = youtubeUrl.extractId(url);
    switch (true) {
      case this.youTubeId !== false:
        return `<iframe width="560" height="315" src="https://www.youtube.com/embed/${this.youTubeId}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
      default:
        return '<div notDefinedOembed />';
    }
  }
}

module.exports = OembedParser;
