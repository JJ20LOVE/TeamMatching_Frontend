<template>
  <view class="user-page">
    <view v-if="type === 'launched'" class="launched-wrapper">
      <view
        v-for="(item, index) in launchedList"
        :key="index"
        class="project-card launched-card"
      >
        <text class="project-title">{{ item.title }}</text>
      </view>
      <button class="btn btn-primary create-btn" @tap="onCreateProject">
        创建新项目
      </button>
    </view>

    <view v-else-if="type === 'joined'" class="joined-wrapper">
      <view
        v-for="(item, index) in joinedList"
        :key="index"
        class="project-card joined-card"
        :class="`status-${item.status}`"
      >
        <view class="joined-main">
          <text class="project-title">{{ item.title }}</text>
          <text class="status-text">{{ item.statusText }}</text>
        </view>
      </view>
    </view>

    <view v-else class="empty-wrapper">
      <text class="empty-text">草稿箱暂无内容</text>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      type: 'launched',
      launchedList: [
        { title: '基于AI的校园组队平台' },
        { title: '何意味' }
      ],
      joinedList: [
        { title: '基于校园的AI组队平台', status: 'pending', statusText: '申请中' },
        { title: '项目二', status: 'passed', statusText: '已通过' },
        { title: '项目三', status: 'rejected', statusText: '被拒' }
      ]
    }
  },
  onLoad(options) {
    if (options && options.type) {
      this.type = options.type
    }
    this.updateTitle()
  },
  methods: {
    updateTitle() {
      let title = '我的项目'
      if (this.type === 'launched') title = '我发起的项目'
      else if (this.type === 'joined') title = '我加入的项目'
      else if (this.type === 'draft') title = '草稿箱'
      uni.setNavigationBarTitle({ title })
    },
    onCreateProject() {
      uni.showToast({
        title: '跳转到创建项目页（待接入）',
        icon: 'none'
      })
    }
  }
}
</script>

<style lang="scss">
.user-page {
  padding: 32rpx;
  background-color: #f5f7fb;
  min-height: 100vh;
  box-sizing: border-box;
}

.project-card {
  background-color: #fff;
  border-radius: 24rpx;
  padding: 28rpx 32rpx;
  box-shadow: 0 8rpx 24rpx rgba(0, 0, 0, 0.04);
  margin-bottom: 24rpx;
}

.project-title {
  font-size: 30rpx;
  color: #333;
}

.create-btn {
  margin-top: 8rpx;
}

.btn {
  height: 80rpx;
  line-height: 80rpx;
  font-size: 28rpx;
  border-radius: 20rpx;
}

.btn-primary {
  background-color: #355ac9;
  color: #fff;
}

.joined-card {
  padding: 24rpx 28rpx;
}

.joined-main {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.status-text {
  font-size: 24rpx;
}

.status-pending {
  background-image: linear-gradient(90deg, #ffeaa7, #ffe9d2);
}

.status-pending .status-text {
  color: #f0a930;
}

.status-passed {
  background-image: linear-gradient(90deg, #e1f7e9, #f2fff6);
}

.status-passed .status-text {
  color: #3bb95c;
}

.status-rejected {
  background-image: linear-gradient(90deg, #ffe3e3, #fff2f2);
}

.status-rejected .status-text {
  color: #e64f4f;
}

.empty-wrapper {
  margin-top: 120rpx;
  display: flex;
  justify-content: center;
}

.empty-text {
  font-size: 26rpx;
  color: #999;
}
</style>

