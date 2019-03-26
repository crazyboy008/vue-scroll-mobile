import Scroll from './components/scroll/Scroll.vue'

Scroll.install = function (Vue) {
  Vue.component(Scroll.name, Scroll)
}

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(Scroll)
}

export default Scroll