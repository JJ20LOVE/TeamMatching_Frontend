<template>
  <view class="card section-card">
    <view class="section-header">
      <view class="section-icon section-icon-tag"></view>
      <text class="section-title">我的简历 / 技能树</text>
    </view>
    <view class="divider"></view>
    <view class="skill-tags">
      <view
        v-for="(skill, index) in skills"
        :key="index"
        class="skill-chip"
      >
        <text class="skill-text">{{ skill }}</text>
      </view>
    </view>
    <view class="skill-actions">
      <view class="add-btn" @tap="$emit('add')">
        <text class="add-btn-plus">＋</text>
        <text class="add-btn-text">添加</text>
      </view>
      <view class="add-btn" @tap="$emit('add')">
        <text class="add-btn-plus">＋</text>
        <text class="add-btn-text">添加</text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: 'SkillTags',
  props: {
    skills: {
      type: Array,
      default: () => []
    }
  }
}
</script>

