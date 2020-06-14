import App from './App.svelte'

const app = new App({
  target: document.getElementById('hextype-app'),
  props: {
    text: ''
  }
});

export default app
