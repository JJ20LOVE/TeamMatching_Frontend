<template>
  <view class="settings-page">
    <!-- 账号与安全 -->
    <view class="section">
      <view class="section-title">账号与安全</view>
      <SettingItem title="修改密码" @click="goToChangePassword" />
      <SettingItem title="绑定手机号" @click="goToBindPhone" />
      <SettingItem title="退出登录" @click="handleLogout" />
    </view>

    <!-- 通知设置 -->
    <view class="section">
      <view class="section-title">通知设置</view>
      <SettingItem
        title="新消息提醒"
        showSwitch
        :switchValue="notifyEnabled"
        @switch-change="handleNotifyChange"
      />
    </view>

    <!-- 关于我们 -->
    <view class="section">
      <view class="section-title">关于我们</view>
      <SettingItem title="版本号" desc="v1.0.0" />
      <SettingItem title="用户协议" @click="goToAgreement" />
    </view>
  </view>
</template>

<script>
import SettingItem from "@/components/SettingItem.vue";

export default {
  components: {
    SettingItem
  },
  data() {
    return {
      notifyEnabled: true
    };
  },
  methods: {
    goToChangePassword() {
      uni.navigateTo({
        url: "/pages/change-password/change-password"
      });
    },
    goToBindPhone() {
      uni.navigateTo({
        url: "/pages/bind-phone/bind-phone"
      });
    },
    handleNotifyChange(val) {
      this.notifyEnabled = val;
      // 后续对接接口保存设置
    },
    goToAgreement() {
      uni.navigateTo({
        url: "/pages/agreement/agreement"
      });
    },
    handleLogout() {
      uni.showModal({
        title: "提示",
        content: "确定要退出登录吗？",
        success: (res) => {
          if (res.confirm) {
            uni.clearStorageSync();
            uni.reLaunch({
              url: "/pages/login/login"
            });
          }
        }
      });
    }
  }
};
</script>

<style scoped>
.settings-page {
  background-color: #f5f5f5;
  min-height: 100vh;
  padding: 20rpx;
}

.section {
  background-color: #fff;
  border-radius: 16rpx;
  margin-bottom: 20rpx;
  overflow: hidden;
}

.section-title {
  font-size: 28rpx;
  color: #666;
  padding: 20rpx 30rpx;
  border-bottom: 1rpx solid #eee;
}
</style>