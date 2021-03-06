
# vue-scroll H5 滚动组件支持下拉刷新和上拉加载更多

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run dev
```
### npm download
```
npm install vue-scroll-m -S
```

## 示例

<img src="http://img2.jpjie.com/h5/vue-scroll-m/ifbueh1553572800311.gif"/>
<img src="http://img2.jpjie.com/h5/vue-scroll-m/qrcode-1553587990.png"/>
* 手机打开微信或QQ二维码扫码查看示例

* [打开链接demo](http://img2.jpjie.com/h5/vue-scroll-m/demo-1553586956280.html)

## 使用方法

```vue

<template>
  <div id="app">
    <scroll ref="scroll"
            :data="listData"
            :top="40"
            :bottom="40"
            @onScroll="onScroll"
            @pullingUp="onScrollBottom"
            @pullingDown="onPullingDown">
      <div class="list">
        <div class="item" v-for="(item, index) in listData" :key="index">
        </div>
      </div>
    </scroll>
  </div>
</template>

import Scroll from 'vue-scroll-m'

export default {
  components: {
    Scroll
  },
}

```

## 配置说明
| 参数     | 类型     | 描述 | 必需 | 默认值 |
| :------------- | :------------- | :------------- | :------------- | :------------- |
| data         | array      | 滚动列表渲染的数据 | 是 | [] |
| top         | number或string      | 滚动列表相对顶部位置 | 否 | 0 |
| bottom         | number或string      | 滚动列表相对底部位置 | 否 | 0 |
| triggerHeight         | number或string      | 触发pullingUp事件高度 | 否 | 200 |
| onScroll         | function      | 监听列表滚动 | 否 | |
| pullingUp         | function      | 滚动到底部加载更多触发 | 否 |  |
| pullingDown         | function      | 下拉刷新回调方法 | 否 |  |