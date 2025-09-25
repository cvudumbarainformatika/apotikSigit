import { defineAsyncComponent } from 'vue'

export default {
  install(app) {
    const components = import.meta.glob('./*.vue');

    function toKebabCase(str) {
      return str
        .replace(/([a-z0-9])([A-Z])/g, '$1-$2') // abcX -> abc-X
        .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2') // XMLParser -> XML-Parser
        .toLowerCase()
    }

    // for (const path in components) {
    //   const component = components[path].default;
    //   const filename = path.split('/').pop().replace('.vue', '');

    //   const tagName = 'u-' + toKebabCase(filename); // u-btn(); // jadikan u-btn, u-card, dst

    //   app.component(tagName, defineAsyncComponent(component));
    // }
    for (const path in components) {
      const filename = path.split('/').pop().replace('.vue', '');
      const tagName = 'u-' + toKebabCase(filename);

      const loader = components[path]; // fungsi () => import('...')
      app.component(tagName, defineAsyncComponent(loader));
    }
  },
};