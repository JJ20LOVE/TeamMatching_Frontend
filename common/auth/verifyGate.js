import api from '@/common/api/index.js'

/**
 * 统一拦截：需要学生认证的功能入口
 * - 未登录：跳登录
 * - 已登录未通过认证：跳认证页
 */
export async function ensureStudentVerified(featureName = '该功能') {
  const token = uni.getStorageSync('access-token')
  if (!token) {
    uni.showToast({ title: '请先登录', icon: 'none' })
    setTimeout(() => uni.navigateTo({ url: '/pages/login/login' }), 300)
    return false
  }

  try {
    const res = await api.getAuthStatus()
    const st = Number(res?.data?.authStatus)
    if (st === 1) return true

    let tip = `${featureName}需要先完成学生认证`
    if (st === 0) tip = '你的学生认证审核中，暂不可使用该功能'
    if (st === 2) tip = '学生认证未通过，请完善后重试'
    uni.showToast({ title: tip, icon: 'none' })
    setTimeout(() => uni.navigateTo({ url: '/pages/user/auth' }), 300)
    return false
  } catch (e) {
    // 请求异常时给出兜底提示，避免静默失败
    uni.showToast({ title: '请先完成学生认证', icon: 'none' })
    setTimeout(() => uni.navigateTo({ url: '/pages/user/auth' }), 300)
    return false
  }
}
