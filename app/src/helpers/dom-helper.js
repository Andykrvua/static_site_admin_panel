export default class DOMHelper {
  // static позволяет обращаться к методам не создавая их экземпляры
  static parseStrToDom(str) {
    // превращаем страницу в dom элементы, может быть ошибка с svg! проверить
    const parser = new DOMParser();
    return parser.parseFromString(str, "text/html");
  }

  static wrapTextNodes(dom) {
    // метод оборачивающий все нужные узлы в кастомный компонент
    const body = dom.body;
    let textNodes = [];

    function recursy(element) {
      element.childNodes.forEach(node => {
        if (
          node.nodeName === "#text" &&
          node.nodeValue.replace(/\s+/g, "").length > 0
        ) {
          textNodes.push(node);
        } else {
          recursy(node);
        }
      });
    }

    recursy(body);
    textNodes.forEach((node, i) => {
      const wrapper = dom.createElement("text-editor");
      node.parentNode.replaceChild(wrapper, node);
      wrapper.appendChild(node);
      wrapper.setAttribute("nodeid", i); // установим id для каждой ноды
    });

    return dom;
  }

  static serializeDOMToString(dom) {
    // метод переводит dom в строку для обработки в php
    const serializer = new XMLSerializer();
    return serializer.serializeToString(dom);
  }

  static unwrapTextNodes(dom) {
    // метод убирает кастомную обертку с наших dom ущлов
    dom.body.querySelectorAll("text-editor").forEach(element => {
      element.parentNode.replaceChild(element.firstChild, element);
    });
  }
}
