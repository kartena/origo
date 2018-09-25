import cu from 'ceeu';

export default function Footer(options = {}) {
  const {
    cls = '',
    data = {}
  } = options;

  return cu.Component({
    render: function render() {
      let middleContent = '';
      if (data.img) {
        middleContent = `<img src="${data.img}">`;
      } else if (data.url && data.urlText) {
        middleContent = `<a href="${data.url}">${data.urlText}</a>">`;
      } else if (data.text) {
        middleContent = `<p>${data.text}</p>`;
      }

      return `<div id="o-footer" class="o-footer relative">
                <div id="o-console" class="o-footer-left">&nbsp;</div>
                <div class="o-footer-middle">
                  <div class="o-footer-middle-content">
                    ${middleContent}
                  </div>
                </div>
                <div class="o-footer-right"></div>
              </div>`;
    }
  });
}