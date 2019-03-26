<template>
  <div id="app">
    <div class="div" @click="goTop">header</div>
    <scroll ref="scroll"
            :data="listData"
            :top="40"
            :bottom="40"
            @onScroll="onScroll"
            @pullingUp="onScrollBottom"
            @pullingDown="onPullingDown">
      <div class="list">
        <div class="item" v-for="(item, index) in listData" :key="index">
          <p>{{item.title}}</p>
          <p>{{item.desc}}</p>
          <div>
            <img :src="item.img" width="100%" height="300" alt="">
          </div>
        </div>
      </div>
    </scroll>
    <div class="div footer">footer</div>
  </div>
</template>

<script>
import Scroll from './components/scroll/Scroll.vue'

let json = [{
  title: '我是title1',
  desc: '这是一段测试文字',
  img: 'https://ww1.sinaimg.cn/large/663d3650gy1fq66vw50iwj20ff0aaaci.jpg'
},{
  title: '我是title2',
  desc: '这是一段测试文字',
  img: 'https://ww1.sinaimg.cn/large/663d3650gy1fq66vw50iwj20ff0aaaci.jpg'
},{
  title: '我是title3',
  desc: '这是一段测试文字',
  img: 'https://ww1.sinaimg.cn/large/663d3650gy1fq66vvsr72j20p00gogo2.jpg'
},{
  title: '我是title4',
  desc: '这是一段测试文字',
  img: 'https://ww1.sinaimg.cn/large/663d3650gy1fq66vvsr72j20p00gogo2.jpg'
}]

export default {
  name: 'app',
  components: {
    Scroll
  },
  data() {
    return {
      listData: json,
      num: 1
    }
  },
  methods: {
    onScroll(e) {
//      console.log(e.target.scrollTop)
    },
    onPullingDown() {
      setTimeout(() => {
        this.listData = this.listData.slice(0, 3)
        this.listData.unshift({
          title: `我是更新title${this.num++}`,
          desc: '这是一段测试文字',
          img: 'https://ww1.sinaimg.cn/large/663d3650gy1fq66vw1k2wj20p00goq7n.jpg'
        })
      }, 500)
    },
    onScrollBottom(e) {
      setTimeout(() => {
        this.listData = this.listData.concat(json)
      }, 200)
    },
    goTop() {
      this.$refs.scroll.scrollTo(0, 0)
    }
  }
}
</script>

<style lang="less">
  body {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    margin: 0;
    background-color: rgba(238, 238, 238, 0.8);
  }
  p, img {
    width: 100%;
    margin: 0;
    padding-top: 10px;
    background: #fff;
  }
  .div {
    width: 100%;
    height: 40px;
    line-height: 40px;
    color: #fff;
    font-size: 20px;
    background: blue;
    z-index: 100;
  }
  .footer {
    position: fixed;
    bottom: 0;
  }

</style>
