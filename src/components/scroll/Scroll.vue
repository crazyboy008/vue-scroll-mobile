<template>
  <div class="scroll-wrapper"
       @scroll.passive="handleScroll"
       ref="scrollWrapper">
    <div class="scroll-content" ref="scrollContent">

      <div class="pulldown">
        <div class="icon-wrapper" v-show="beforePullDown">
          <i class="icon-xiajiantou" ref="icon" v-show="!isRefreshEnd"></i>
          <span class="icon-text">{{pullDownText}}</span>
        </div>
        <div class="loading" v-show="!beforePullDown"></div>
      </div>

      <slot></slot>

      <div class="pullup">
        <div class="loading"></div>
      </div>

    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import { addClass, removeClass } from '../../assets/js/dom'
  const pulldownHeight = 60 // 下拉刷新临界点
  const pulldownTop = 40  // 进入下拉刷新位移top
  const moveCount = 200  // 下拉位移系数

  export default {
    name: 'scroll',
    props: {
      data: {
        type: Array,
        default() {
          return []
        }
      }
    },
    data() {
      return {
        beforePullDown: true,
        isRefreshEnd: null, // 是否下拉刷新完成
        joinRefresh: null, // 进入下拉刷新状态
        refreshFlag: 0, // 下拉刷新执行标志位
        translateY: 0, // 下拉位移Y值
        pullDownText: '下拉刷新'
      }
    },
    methods: {
      touchStart(e) {
        if (this.refreshFlag) {
          e.preventDefault()
          return
        }
        this.firstOffsetY = e.changedTouches[0].clientY
      },
      touchMove(e) {
        if (!this.firstOffsetY) {
          return
        }
        if (this.refreshFlag) {
          e.preventDefault()
          e.stopPropagation()
          return
        }
        if (this.$refs.scrollWrapper.scrollTop === 0) {
          // 拖动量的百分比
          let percentage = (e.changedTouches[0].clientY - this.firstOffsetY) / window.innerHeight
          if (percentage > 0) {
            e.preventDefault()
            this.joinRefresh = true
            this.translateY = percentage * moveCount

            this.$refs.scrollContent.style.transform = `translate3d(0, ${this.translateY}px, 0)`
            this.$refs.scrollContent.style.webkitTransform = `translate3d(0, ${this.translateY}px, 0)`

            if (this.translateY > pulldownHeight) {
              this.pullDownText = '松开刷新'
              removeClass(this.$refs.icon, 'down')
              addClass(this.$refs.icon, 'up')
            } else {
              this.pullDownText = '下拉刷新'
              removeClass(this.$refs.icon, 'up')
              addClass(this.$refs.icon, 'down')
            }
          } else {
            if (this.joinRefresh === null) this.joinRefresh = false
          }
        } else {
          if (this.joinRefresh === null) this.joinRefresh = false
        }
      },
      touchEnd(e) {
        if (this.translateY === 0) {
          return
        }
        if (this.refreshFlag) {
          e.preventDefault()
          e.stopPropagation()
          return
        }
        if (this.translateY > pulldownHeight && this.joinRefresh) {
          this.beforePullDown = false
          this.refreshFlag = 1

          this.$refs.scrollContent.style.transform = `translate3d(0, ${pulldownTop}px, 0)`
          this.$refs.scrollContent.style.webkitTransform = `translate3d(0, ${pulldownTop}px, 0)`
          this.$refs.scrollContent.style.transition = 'all 0.3s linear'

          this.$emit('pullingDown')
        } else {
          if (this.joinRefresh) {
            this.refreshFlag = 1
            this.reset()
          }
        }

        // touchend 重置默认值
        this.translateY = 0
        this.joinRefresh = null
        this.firstOffsetY = null
        removeClass(this.$refs.icon, 'up')
      },
      // 下拉刷新完成
      refreshEnd() {
        this.beforePullDown = true
        this.isRefreshEnd = true
        this.pullDownText = '刷新成功'
        this.reset()
      },
      // 下拉刷新完成重置
      reset() {
        this.$refs.scrollContent.style.transform = `translate3d(0, 0, 0)`
        this.$refs.scrollContent.style.webkitTransform = `translate3d(0, 0, 0)`
        if (!this.$refs.scrollContent.style.transition) {
          this.$refs.scrollContent.style.transition = 'all 0.3s linear'
        }
        setTimeout(() => {
          this.refreshFlag = 0
          this.isRefreshEnd = null
          this.pullDownText = '下拉刷新'
          this.$refs.scrollContent.style.transition = null
        }, 300)
      },
      handleScroll(e) {
        const scrollOffsetY = e.target.scrollTop || window.pageYOffset || document.body.scrollTop
        this.$emit('onScroll', e, scrollOffsetY)
        const offsetHeight = this.$refs.scrollContent.offsetHeight
        if (offsetHeight <= e.target.offsetHeight) return
        if (scrollOffsetY + e.target.offsetHeight === offsetHeight) {
          this.$emit('pullingUp', e, scrollOffsetY) // 滚动到底部加载更多
        }
      },
      // 初始化滚动元素高度
      refresh() {
        this.$refs.scrollWrapper.style.height = window.innerHeight + 'px'
      },
      // 滚动到指定坐标
      scrollTo(x, y) {
        this.$refs.scrollWrapper.scrollTo(x, y)
      }
    },
    mounted() {
      this.refresh()
      this.$refs.scrollContent.addEventListener('touchstart', this.touchStart)
      this.$refs.scrollContent.addEventListener('touchmove', this.touchMove)
      this.$refs.scrollContent.addEventListener('touchend', this.touchEnd)
    },
    beforeDestroy () {
      this.$refs.scrollContent.removeEventListener('touchmove', this.touchStart)
      this.$refs.scrollContent.removeEventListener('touchmove', this.touchMove)
      this.$refs.scrollContent.removeEventListener('touchend', this.touchEnd)
    },
    watch: {
      data(newVal, oldVal) {
        // 下拉刷新完成监听data改变触发
        if (this.refreshFlag === 1) {
          this.refreshEnd()
        }
      }
    }
  }
</script>

<style scoped lang="less" rel="stylesheet/less">
  .scroll-wrapper {
    width: 100%;
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;
    &::-webkit-scrollbar {
      display: none;
    }
    .scroll-content {
      position: relative;
      .pulldown {
        position: fixed;
        top: -40px;
        left: 0;
        right: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 40px;
        background-color: rgba(238, 238, 238, 0.8);
        .icon-wrapper {
          display: flex;
          justify-content: center;
          align-items: center;
          .icon-xiajiantou {
            felx: 0 0 10px;
            width: 10px;
            height: 30px;
            vertical-align: middle;
            background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAABQBAMAAAD8TNiNAAAAJ1BMVEUAAACqqqplZWVnZ2doaGhqampoaGhpaWlnZ2dmZmZlZWVmZmZnZ2duD78kAAAADHRSTlMAA6CYqZOlnI+Kg/B86E+1AAAAhklEQVQ4y+2LvQ3CQAxGLSHEBSg8AAX0jECTnhFosgcjZKr8StE3VHz5EkeRMkF0rzk/P58k9rgOW78j+TE99OoeKpEbCvcPVDJ0OvsJ9bQs6Jxs26h5HCrlr9w8vi8zHphfmI0fcvO/ZXJG8wDzcvDFO2Y/AJj9ADE7gXmlxFMIyVpJ7DECzC9J2EC2ECAAAAAASUVORK5CYII=");
            background-size: 100% 100%;
            &.up {
              transform: rotate(180deg);
              transition: transform .4s;
              transform-origin: center center;
            }
            &.down {
              transform: rotate(0deg);
              transition: transform .4s;
              transform-origin: center center;
            }
          }
          .icon-text {
            color: #666;
            font-size: 14px;
            padding-left: 10px;
          }
        }
      }
      .pullup {
        width: 100%;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: rgba(238, 238, 238, 0.8);
        color: #666;
        font-size: 14px;
      }
      @-webkit-keyframes spinner-12 {
        0% {
          -webkit-transform: rotate(0deg);
        }

        8.333333333333332% {
          -webkit-transform: rotate(30deg);
        }

        16.666666666666664% {
          -webkit-transform: rotate(60deg);
        }

        25% {
          -webkit-transform: rotate(90deg);
        }

        33.33333333333333% {
          -webkit-transform: rotate(120deg);
        }

        41.66666666666667% {
          -webkit-transform: rotate(150deg);
        }

        50% {
          -webkit-transform: rotate(180deg);
        }

        58.333333333333336% {
          -webkit-transform: rotate(210deg);
        }

        66.66666666666666% {
          -webkit-transform: rotate(240deg);
        }

        75% {
          -webkit-transform: rotate(270deg);
        }

        83.33333333333334% {
          -webkit-transform: rotate(300deg);
        }

        91.66666666666666% {
          -webkit-transform: rotate(330deg);
        }
      }

      .loading:before {
        display: inline-block;
        width: 20px;
        height: 20px;
        content: " ";
        -webkit-animation: spinner-12 1s step-start infinite;
        vertical-align: middle;
        background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAoCAMAAAC7IEhfAAABg1BMVEUAAAC9vcGpqayzs7bNzdGYmJuVlZjKys6bm5/Jyc2cnJ+cnJ/Kys3Ly8+cnJ/R0dWfn6PJyczDw8fIyMzR0dXIyMzExMeioqXLy8+oqKzNzdGzs7a2trmdnaCUlJevr7LHx8uXl5q2trmenqGwsLO2trqxsbWhoaSXl5qxsbS1tbmwsLSjo6eUlJe4uLucnJ+VlZjIyMzDw8eysragoKOXl5qVlZjR0dXR0dW2trqioqbCwsbR0dWjo6a2trqZmZyzs7agoKPR0dWjo6bCwsbQ0NSvr7LJyc2cnKDFxcm8vL+ZmZzOztHMzNC+vsKXl5uZmZyjo6a9vcGYmJyurrGtrbHOztK3t7ucnJ+urrGjo6fHx8uxsbTDw8etrbCkpKe4uLzBwcWxsbSbm564uLvExMjR0dWYmJuUlJiioqbNzdHDw8e7u7+oqKvIyMy3t7q1tbmwsLOurrKdnaCcnJ+pqazCwsa9vcHJyc3OztLMzNCXl5qqqq2hoaW+vsK+vsHIyMsWRiyNAAAAZnRSTlMA5uYS5uaBExMQEAwLAQH4+Pf2wYODg4BfSSAMAcHBwKqpg4KBf19fXCL49/f39fX05ubm5ubm5cTEw8G+vru4q6uqhX9+fn19WUpKSUlJSSQhHh739efl5eTkxsS3qKinpoeEWSQqdCoWAAACIElEQVQ4y7XT91faUBTA8RumEBKRLaAisrR171m3VVut3Xs3JVDCtnQI/dN783g5jDzHL35/5HzOveddTkDfA5PpIdwkUyZjgiuy7e3ZQO1XJvO7+cvBgY0B1yRpSWiHgrumuBmwV5KkQDs8rClKHwNuI1x0tKBjGmGEAYPqSE8LetWBQWDkQdgb1GCwr6b88wIrxyLKbYDn5DwRHDjt6AD2wfHhR4AF1JHawdWB5G3fIq53zStZ0un0uIXHeyxJ0hrQ3IryRsA1Plc2m93VILaQEsHq8Vg1aPV6rSAEZpCdn+/S1WnSYA90ZXVniVulf5CYWiDS0g19hM0cCqDFW6aYEJnL1/n0J8NT9/SrV12fHsOtdTr/hzR/CoxOuHq93mg0uBMwf6eZWZD7SeOugz9oHBybqTtmwSOOuiO4rfDgk/qDGzcmPnYenP8yWalURrphPJ/PT0RDoCWmXiIrl3UwWiggffE1DCT7AGHlAf3q5QKhy0ZQu0/YXFKEHr8fMUWxmBHCiVlC402IzDnCA4grF/K6BodKxbe4MhQdQxqnq51b5ONKXsjyXYB+g6Ef4FmpWEwANro5tmHsfPocwg8AhlzVAPC+VCrOhoDVjjrwDCCXq/7FQU9x5GeWO3PKsrwDGoQYjrwzyoBb6F7zLRh6hSM3GVAdmIQWhIQ6kgHXZXlFbIdhvNAQA9r9fjtQWG3efH/fCJdGz3N99OC6/gMPF6RsShfrcQAAAABJRU5ErkJggg==");
        background-size: 20px 20px;
      }
    }
  }
</style>
