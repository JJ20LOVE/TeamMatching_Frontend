<template>
  <view class="create-page">
    <!-- 从「我发起的项目」进入编辑时：显式返回列表（switchTab 会打断页面栈，系统返回无效） -->
    <view v-if="editingProjectId" class="edit-back-row" @tap="onBackFromEdit">
      <text class="edit-back-icon">‹</text>
      <text class="edit-back-text">返回我发起的项目</text>
    </view>

    <!-- 顶部步骤：填写 → 预览确认 -->
    <view class="steps">
      <view
        class="step-item"
        :class="stepStatus[1] ? 'done' : currentStep === 1 ? 'active' : ''"
        @click="goStep(1)"
      >
        <text v-if="stepStatus[1]">✓</text> 填写信息
      </view>
      <view
        class="step-item"
        :class="stepStatus[2] ? 'done' : currentStep === 2 ? 'active' : ''"
        @click="goStep(2)"
      >
        <text v-if="stepStatus[2]">✓</text> 预览确认
      </view>
    </view>

    <!-- 步骤内容区域 -->
    <scroll-view class="content" scroll-y :scroll-top="scrollTop">
      <!-- 单页：基本信息 + 团队与角色（原步骤 1、2 合并） -->
      <view v-if="currentStep === 1">
        <FormCard title="项目基本信息">
          <view class="form-item">
            <text class="label">项目名称<text class="req">*</text></text>
            <input v-model="form.name" placeholder="请输入项目名称" class="input" />
          </view>
          <view class="form-item">
            <text class="label">项目描述<text class="req">*</text></text>
            <textarea v-model="form.desc" placeholder="请输入项目描述" class="textarea" />
          </view>
        </FormCard>

        <FormCard title="赛道与分级">
          <view class="form-item">
            <text class="label">所属赛道<text class="req">*</text></text>
            <view class="select" @click="selectTrackKind">{{ trackKindLabel }}</view>
          </view>
          <view v-if="form.trackKind === 'custom'" class="form-item">
            <text class="label">自定义赛道名称<text class="req">*</text></text>
            <input v-model="form.customTrack" placeholder="请输入具体赛道名称" class="input" />
          </view>
          <view class="form-item">
            <text class="label">项目级别<text class="req">*</text></text>
            <view class="select" @click="selectLevel">
              {{ levelDisplay }}
            </view>
          </view>
          <view class="form-item">
            <text class="label">项目状态<text class="req">*</text></text>
            <view class="select" @click="selectApiStatus">
              {{ apiStatusDisplay }}
            </view>
          </view>
        </FormCard>

        <FormCard title="标签">
          <view class="tag-quick-row">
            <view
              v-for="t in quickTagOptions"
              :key="t"
              class="quick-tag"
              :class="{ 'quick-tag--on': quickTagOn(t) }"
              @click="toggleQuickTag(t)"
            >
              <text>{{ t }}</text>
            </view>
          </view>
          <view class="form-item">
            <input v-model="form.tags" placeholder="例如：AI,前端,组队" class="input" />
          </view>
        </FormCard>

        <FormCard title="项目进展">
          <view class="form-item">
            <text class="label">项目进展说明<text class="req">*</text></text>
            <textarea v-model="form.projectProgress" placeholder="如：当前阶段、已完成事项、下一步计划" class="textarea" />
          </view>
        </FormCard>

        <FormCard title="项目附件">
          <view class="form-item">
            <view class="upload-attach-trigger" @click="uploadProjectAttachment">
              <text v-if="form.projectAttachmentFileName" class="upload-attach-value">{{ form.projectAttachmentFileName }}</text>
              <text v-else class="upload-attach-placeholder">点击上传文件</text>
              <text
                v-if="form.projectAttachmentFileId"
                class="upload-attach-del"
                @click.stop="clearProjectAttachment"
              >移除</text>
              <text v-else class="upload-attach-link">上传</text>
            </view>
          </view>
        </FormCard>

        <FormCard title="招聘需求">
          <view class="add-row">
            <button class="add-btn" @click="addRole">添加角色</button>
          </view>

          <view class="role-group" v-for="(item, idx) in form.roles" :key="'rg-' + idx">
            <view class="role-group-head">
              <text class="role-group-title">角色 {{ idx + 1 }}</text>
              <text v-if="form.roles.length > 1" class="role-remove" @click="removeRole(idx)">删除角色</text>
            </view>
            <view class="form-item">
              <text class="label">角色名称<text class="req">*</text></text>
              <input v-model="item.name" placeholder="如：前端、后端、设计" class="input" />
            </view>
            <view class="form-item">
              <text class="label">招募数量<text class="req">*</text></text>
              <input v-model="item.count" placeholder="请输入数字" class="input" />
            </view>
          </view>
        </FormCard>

        <FormCard title="招募设置">
          <view class="form-item">
            <text class="label">截止时间<text class="req">*</text></text>
            <view class="deadline-pickers">
              <picker mode="date" :value="form.deadlineDate" @change="onDeadlineDateChange">
                <view class="picker-value">{{ form.deadlineDate || '选择日期' }}</view>
              </picker>
              <picker mode="time" :value="form.deadlineTime" @change="onDeadlineTimeChange">
                <view class="picker-value">{{ form.deadlineTime || '选择时间' }}</view>
              </picker>
            </view>
          </view>
          <view class="form-item switch-row">
            <text class="label">匿名发布</text>
            <view class="switch" :class="form.isAnonymous ? 'on' : ''" @click="form.isAnonymous = !form.isAnonymous">
              <view class="switch-circle"></view>
            </view>
          </view>
          <view v-if="form.isAnonymous" class="form-item">
            <text class="label">对外联系方式<text class="req">*</text></text>
            <input v-model="form.contactInfo" placeholder="匿名时在广场展示的联系方式，如：队长微信 xxx" class="input" />
          </view>
        </FormCard>

        <FormCard title="角色详情配置">
          <view class="form-item role-req-block" v-for="(item, idx) in form.roles" :key="'req-' + idx">
            <view class="role-req-head">
              <text class="label">{{ item.name || '未命名角色' }} ({{ item.count || 0 }}人)</text>
              <text v-if="form.roles.length > 1" class="role-remove" @click="removeRole(idx)">删除角色</text>
            </view>
            <textarea v-model="item.requirement" placeholder="具体要求：" class="textarea" />
          </view>
        </FormCard>
      </view>

      <!-- 预览（点击「发布」后自动进入） -->
      <view v-if="currentStep === 2">
        <FormCard>
          <view class="preview-title">{{ form.name || '基于AI的校园组队平台' }}</view>
          <view class="preview-tags">
            <view class="tag tag-type">{{ belongTrackPreview }}</view>
            <view class="tag tag-status">{{ apiStatusDisplay }}</view>
            <view class="tag tag-level">{{ levelDisplay }}</view>
          </view>
          <view v-if="form.tags" class="preview-tags-line">标签：{{ form.tags }}</view>
          <view v-if="form.projectProgress" class="preview-features">进展：{{ form.projectProgress }}</view>
          <view v-if="form.projectAttachmentFileName" class="preview-tags-line">附件：{{ form.projectAttachmentFileName }}</view>
          <view v-if="form.isAnonymous" class="preview-anon">匿名发布 · 联系方式：{{ form.contactInfo || '未填写' }}</view>
          <view class="preview-desc">
            项目描述预览：{{ form.desc || '本项目旨在利用人工智能技术，为华师大学生提供一个高效，精准的比赛组队平台' }}
          </view>
          <view class="recruit-section">
            <view class="recruit-title">招募信息</view>
            <view class="recruit-deadline">⏰ 截止时间：{{ deadlinePreview || '2025-01-23 23:59' }}</view>
            <view class="role-list">
              <view class="role-item" v-for="(item, idx) in form.roles" :key="idx">
                <view class="role-header">
                  <text>{{ item.name || '前端开发' }} ({{ item.count || 2 }}人)</text>
                  <text class="arrow">∧</text>
                </view>
                <view class="role-req">
                  具体要求：{{ item.requirement || '熟练掌握Vue/React，有小程序开发经验' }}
                </view>
              </view>
            </view>
          </view>
        </FormCard>
      </view>
    </scroll-view>

    <!-- 底部固定按钮 -->
    <view class="footer">
      <template v-if="currentStep === 1">
        <button v-if="!editingProjectId" class="btn draft" @click="saveDraft">保存草稿</button>
        <button class="btn next" @click="goToPreview">{{ editingProjectId ? '预览并保存' : '发布' }}</button>
      </template>
      <template v-else>
        <button class="btn draft" @click="backToEdit">返回修改</button>
        <button class="btn next" @click="submitProject">{{ editingProjectId ? '保存修改' : '确认发布' }}</button>
      </template>
    </view>
  </view>
</template>

<script>
import FormCard from '@/components/FormCard.vue'
import api from '@/common/api/index.js'
import { ensureStudentVerified } from '@/common/auth/verifyGate.js'

export default {
  components: { FormCard },
  data() {
    return {
      currentStep: 1,
	  scrollTop: 0,
      stepStatus: { 1: false, 2: false },
      form: {
        name: '',
        desc: '',
        /** 赛道：dachuang | internet | custom，对应 大创 / 互联网+ / 其它手写 */
        trackKind: 'dachuang',
        customTrack: '',
        /** 接口 status：仅 0草拟 2招募中 3完成 */
        apiStatus: 2,
        /** 接口 level：1校级 2省级 3国家级 */
        level: 1,
        tags: '',
        projectProgress: '',
        projectAttachmentFileId: null,
        projectAttachmentFileName: '',
        isAnonymous: false,
        contactInfo: '',
        deadlineDate: '',
        deadlineTime: '23:59',
        roles: [{ name: '', count: '', requirement: '' }]
      },
      quickTagOptions: ['AI', '前端', '后端', '大创', '数据分析', 'UI设计', '产品经理', '算法', '小程序'],
      trackKindOptions: [
        { label: '大创', value: 'dachuang' },
        { label: '互联网+', value: 'internet' },
        { label: '其它', value: 'custom' }
      ],
      apiStatusOptions: [
        { label: '草拟', value: 0 },
        { label: '招募中', value: 2 },
        { label: '完成', value: 3 }
      ],
      editingDraftId: null,
      editingProjectId: null
    }
  },

  computed: {
    deadlinePreview() {
      if (!this.form.deadlineDate || !this.form.deadlineTime) return ''
      return `${this.form.deadlineDate} ${this.form.deadlineTime}`
    },
    levelDisplay() {
      const m = { 1: '校级', 2: '省级', 3: '国家级' }
      const lv = Number(this.form.level)
      return m[lv] || '校级'
    },
    apiStatusDisplay() {
      const m = { 0: '草拟', 2: '招募中', 3: '完成' }
      const s = Number(this.form.apiStatus)
      return m[s] !== undefined ? m[s] : '招募中'
    },
    trackKindLabel() {
      const k = this.form.trackKind
      if (k === 'dachuang') return '大创'
      if (k === 'internet') return '互联网+'
      return '其它'
    },
    belongTrackPreview() {
      return this.getBelongTrackPayload() || '—'
    }
  },

  onShow() {
    uni.$off('loadDraft')
    uni.$on('loadDraft', (draft) => {
      this.editingProjectId = null
      this.editingDraftId = draft.id // 记录正在编辑的草稿ID
      this.form = this.normalizeDraftForm(draft.form)
      // 兼容旧草稿字段
      if (this.form.deadline && !this.form.deadlineDate) {
        this.form.deadlineDate = String(this.form.deadline).slice(0, 10)
      }
      if (!this.form.deadlineTime) {
        this.form.deadlineTime = '23:59'
      }
      this.applyDraftNavigation(draft)
      uni.setNavigationBarTitle({ title: '新建项目' })
      uni.showToast({ title: '已加载草稿', icon: 'success' })
    })

    uni.$off('editProject')
    uni.$on('editProject', ({ projectId }) => {
      if (projectId != null) this.loadProjectForEdit(projectId)
    })

    uni.$off('clearProjectEdit')
    uni.$on('clearProjectEdit', () => {
      this.resetToNewProject()
    })
  },

  methods: {
    /** 原步骤 1 + 2 合并后的校验 */
    validateForm() {
      const name = this.form.name?.trim()
      const desc = this.form.desc?.trim()
      const track = this.getBelongTrackPayload()
      const progress = String(this.form.projectProgress || '').trim()
      if (!name) return { ok: false, msg: '请填写项目名称' }
      if (!desc) return { ok: false, msg: '请填写项目描述' }
      if (!track) return { ok: false, msg: '请完善所属赛道（其它时请填写名称）' }
      if (!progress) return { ok: false, msg: '请填写项目进展说明' }
      if (!Array.isArray(this.form.roles) || this.form.roles.length === 0) {
        return { ok: false, msg: '请至少添加一个角色需求' }
      }
      for (let i = 0; i < this.form.roles.length; i++) {
        const r = this.form.roles[i] || {}
        const roleName = String(r.name || '').trim()
        const count = String(r.count || '').trim()
        if (!roleName) return { ok: false, msg: `请填写角色名称 ${i + 1}` }
        if (!count) return { ok: false, msg: `请填写角色 ${i + 1} 的招募数量` }
        const n = Number(count)
        if (!Number.isFinite(n) || n <= 0 || !Number.isInteger(n)) {
          return { ok: false, msg: `角色 ${i + 1} 的招募数量需为正整数` }
        }
      }
      const deadline = this.buildDeadlineRecruit()
      if (!deadline) return { ok: false, msg: '请选择截止时间' }
      if (this.form.isAnonymous && !String(this.form.contactInfo || '').trim()) {
        return { ok: false, msg: '匿名发布请填写对外联系方式' }
      }
      return { ok: true }
    },

    /** 恢复草稿时的步骤（兼容旧版三步 wizard） */
    applyDraftNavigation(draft) {
      if (draft.wizard === 'v2' && Number(draft.currentStep) === 2) {
        const v = this.validateForm()
        if (v.ok) {
          this.currentStep = 2
          this.stepStatus = { 1: true, 2: true }
          return
        }
      }
      const cs = Number(draft.currentStep) || 1
      if (cs >= 3) {
        const v = this.validateForm()
        if (v.ok) {
          this.currentStep = 2
          this.stepStatus = { 1: true, 2: true }
          return
        }
      }
      this.currentStep = 1
      this.stepStatus = { 1: false, 2: false }
    },

    goToPreview() {
      const v = this.validateForm()
      if (!v.ok) {
        uni.showToast({ title: v.msg, icon: 'none' })
        return
      }
      this.stepStatus = { 1: true, 2: true }
      this.currentStep = 2
      this.scrollTop = 0
    },

    backToEdit() {
      this.currentStep = 1
      this.scrollTop = 0
    },
    onDeadlineDateChange(e) {
      this.form.deadlineDate = e.detail.value
    },
    onDeadlineTimeChange(e) {
      this.form.deadlineTime = e.detail.value
    },
    buildDeadlineRecruit() {
      const d = this.form.deadlineDate
      const t = this.form.deadlineTime
      if (!d || !t) return ''
      // 后端字段是 LocalDateTime，需要 YYYY-MM-DDTHH:mm:ss
      return `${d}T${t}:00`
    },
    goStep(step) {
      if (step === this.currentStep) return
      if (step < this.currentStep) {
        this.currentStep = step
        this.scrollTop = 0
        return
      }
      if (step === 2) {
        const v = this.validateForm()
        if (!v.ok) {
          uni.showToast({ title: v.msg, icon: 'none' })
          return
        }
        this.stepStatus = { 1: true, 2: true }
        this.currentStep = 2
        this.scrollTop = 0
      }
    },

    getBelongTrackPayload() {
      if (this.form.trackKind === 'dachuang') return '大创'
      if (this.form.trackKind === 'internet') return '互联网+'
      return String(this.form.customTrack || '').trim()
    },

    selectTrackKind() {
      const labels = this.trackKindOptions.map((x) => x.label)
      uni.showActionSheet({
        itemList: labels,
        success: (res) => {
          const opt = this.trackKindOptions[res.tapIndex]
          if (opt) this.form.trackKind = opt.value
        }
      })
    },

    quickTagOn(t) {
      const parts = String(this.form.tags || '')
        .split(/[,，]/)
        .map((s) => s.trim())
        .filter(Boolean)
      return parts.includes(t)
    },

    toggleQuickTag(t) {
      let parts = String(this.form.tags || '')
        .split(/[,，]/)
        .map((s) => s.trim())
        .filter(Boolean)
      const i = parts.indexOf(t)
      if (i >= 0) parts.splice(i, 1)
      else parts.push(t)
      this.form.tags = parts.join(',')
    },

    selectLevel() {
      uni.showActionSheet({
        itemList: ['校级', '省级', '国家级'],
        success: (res) => {
          this.form.level = res.tapIndex + 1
        }
      })
    },

    selectApiStatus() {
      const labels = this.apiStatusOptions.map((x) => x.label)
      uni.showActionSheet({
        itemList: labels,
        success: (res) => {
          const opt = this.apiStatusOptions[res.tapIndex]
          if (opt) this.form.apiStatus = opt.value
        }
      })
    },

    /** 合并旧版草稿缺省字段 */
    normalizeDraftForm(raw) {
      const f = JSON.parse(JSON.stringify(raw || {}))
      if (f.apiStatus === undefined && f.status) {
        const legacy = { 招募中: 2, 已结束: 4 }
        f.apiStatus = legacy[f.status] != null ? legacy[f.status] : 2
      }
      if (f.apiStatus === undefined || f.apiStatus === '') f.apiStatus = 2
      f.apiStatus = this.normalizeStatusForForm(f.apiStatus)
      if (f.level === undefined || f.level === '') f.level = 1
      if (f.tags === undefined) f.tags = ''
      if (f.projectProgress === undefined) f.projectProgress = ''
      if (f.projectAttachmentFileId === undefined) f.projectAttachmentFileId = null
      if (f.projectAttachmentFileName === undefined) f.projectAttachmentFileName = ''
      if (f.isAnonymous === undefined) f.isAnonymous = false
      if (f.contactInfo === undefined) f.contactInfo = ''
      if (!Array.isArray(f.roles) || f.roles.length === 0) {
        f.roles = [{ name: '', count: '', requirement: '' }]
      }
      this.hydrateTrackFromLegacy(f)
      delete f.category
      delete f.projectType
      delete f.projectFeatures
      delete f.allowCrossMajor
      return f
    },

    hydrateTrackFromLegacy(f) {
      if (f.trackKind && ['dachuang', 'internet', 'custom'].includes(f.trackKind)) {
        if (f.trackKind !== 'custom') f.customTrack = f.customTrack || ''
        return
      }
      const c = String(f.category || f.belongTrack || '').trim()
      if (c === '大创') {
        f.trackKind = 'dachuang'
        f.customTrack = ''
      } else if (c === '互联网+' || c === '互联网＋') {
        f.trackKind = 'internet'
        f.customTrack = ''
      } else if (c) {
        f.trackKind = 'custom'
        f.customTrack = c
      } else {
        f.trackKind = 'dachuang'
        f.customTrack = ''
      }
    },

    addRole() {
      this.form.roles.push({ name: '', count: '', requirement: '' })
    },

    removeRole(idx) {
      if (!Array.isArray(this.form.roles) || this.form.roles.length <= 1) {
        uni.showToast({ title: '至少保留一个角色', icon: 'none' })
        return
      }
      this.form.roles.splice(idx, 1)
    },

    chooseLocalFile() {
      return new Promise((resolve, reject) => {
        const onFail = (e) => {
          if (String(e?.errMsg || '').includes('cancel')) resolve('')
          else reject(e)
        }
        const pickPath = (res) => {
          const f0 = res?.tempFiles?.[0]
          return (
            (Array.isArray(res?.tempFilePaths) && res.tempFilePaths[0]) ||
            f0?.path ||
            f0?.tempFilePath ||
            ''
          )
        }
        const docExtensions = ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx']

        // 微信小程序：从会话选择文件（支持 PDF / Office 等）
        // #ifdef MP-WEIXIN
        uni.chooseMessageFile({
          count: 1,
          type: 'file',
          extension: docExtensions,
          success: (res) => resolve(pickPath(res)),
          fail: onFail
        })
        return
        // #endif

        // H5 / App 等：系统文件选择器（否则上面逻辑在非微信端会落到 chooseImage，只能选图片）
        if (typeof uni.chooseFile === 'function') {
          uni.chooseFile({
            count: 1,
            type: 'file',
            extension: docExtensions,
            success: (res) => resolve(pickPath(res)),
            fail: onFail
          })
          return
        }

        uni.chooseImage({
          count: 1,
          sizeType: ['compressed'],
          sourceType: ['album', 'camera'],
          success: (r) => resolve(r?.tempFilePaths?.[0] || ''),
          fail: onFail
        })
      })
    },

    async uploadProjectAttachment() {
      const token = uni.getStorageSync('access-token')
      if (!token) {
        uni.showToast({ title: '请先登录', icon: 'none' })
        return
      }
      try {
        const filePath = await this.chooseLocalFile()
        if (!filePath) return
        uni.showLoading({ title: '上传中…' })
        const uploadRes = await api.uploadFile({ filePath, targetType: 5, isTemp: false })
        const file = uploadRes?.data
        if (!file?.fileId) {
          uni.showToast({ title: '上传失败', icon: 'none' })
          return
        }
        this.form.projectAttachmentFileId = file.fileId
        this.form.projectAttachmentFileName = file.fileName || '已上传附件'
        uni.showToast({ title: '上传成功', icon: 'success' })
      } catch (e) {
        console.error(e)
        uni.showToast({ title: e?.data?.message || e?.message || '上传失败', icon: 'none' })
      } finally {
        uni.hideLoading()
      }
    },

    clearProjectAttachment() {
      this.form.projectAttachmentFileId = null
      this.form.projectAttachmentFileName = ''
    },

    /** 将接口 status 映射为表单允许的 0 / 2 / 3 */
    normalizeStatusForForm(status) {
      const n = Number(status)
      if (n === 0) return 0
      if (n === 3) return 3
      return 2
    },

    onBackFromEdit() {
      this.resetToNewProject()
      uni.navigateTo({
        url: '/pages/user/my-projects?type=launched'
      })
    },

    resetToNewProject() {
      this.editingProjectId = null
      this.editingDraftId = null
      this.currentStep = 1
      this.stepStatus = { 1: false, 2: false }
      this.form = {
        name: '',
        desc: '',
        trackKind: 'dachuang',
        customTrack: '',
        apiStatus: 2,
        level: 1,
        tags: '',
        projectProgress: '',
        projectAttachmentFileId: null,
        projectAttachmentFileName: '',
        isAnonymous: false,
        contactInfo: '',
        deadlineDate: '',
        deadlineTime: '23:59',
        roles: [{ name: '', count: '', requirement: '' }]
      }
      uni.setNavigationBarTitle({ title: '新建项目' })
    },

    parseDeadlineRecruit(raw) {
      if (!raw) return { date: '', time: '23:59' }
      const s = String(raw).replace(/Z$/i, '')
      const [datePart, timePart = ''] = s.split('T')
      let time = '23:59'
      if (timePart) {
        const hm = timePart.match(/^(\d{1,2}):(\d{2})/)
        if (hm) time = `${hm[1].padStart(2, '0')}:${hm[2]}`
      }
      return { date: datePart || '', time }
    },

    applyProjectDetailToForm(data) {
      const { date, time } = this.parseDeadlineRecruit(data.deadlineRecruit)
      const rolesFromApi = Array.isArray(data.roleRequirements) ? data.roleRequirements : []
      const bt = String(data.belongTrack || '').trim()
      let trackKind = 'custom'
      let customTrack = bt
      if (bt === '大创') {
        trackKind = 'dachuang'
        customTrack = ''
      } else if (bt === '互联网+' || bt === '互联网＋') {
        trackKind = 'internet'
        customTrack = ''
      }
      const st = data.status
      this.form = {
        name: data.name || '',
        desc: data.projectIntro || '',
        trackKind,
        customTrack,
        apiStatus: this.normalizeStatusForForm(st),
        level: data.level != null ? data.level : 1,
        tags: data.tags || '',
        projectProgress: data.projectProgress || data.progectProgress || '',
        projectAttachmentFileId: data.attachmentFileId || data.projectAttachmentFileId || null,
        projectAttachmentFileName: data.attachmentFileName || data.projectAttachmentFileName || '',
        isAnonymous: !!data.isAnonymous,
        contactInfo: data.contactInfo || '',
        deadlineDate: date,
        deadlineTime: time,
        roles:
          rolesFromApi.length > 0
            ? rolesFromApi.map((r) => ({
                name: r.role || '',
                count: String(r.memberQuota != null ? r.memberQuota : ''),
                requirement: r.recruitRequirements || ''
              }))
            : [{ name: '', count: '', requirement: '' }]
      }
    },

    async loadProjectForEdit(projectId) {
      try {
        const res = await api.getProjectDetail(projectId)
        const data = res?.data
        if (data == null || data.projectId == null) {
          uni.showToast({ title: '项目不存在', icon: 'none' })
          return
        }
        this.editingDraftId = null
        this.editingProjectId = projectId
        this.applyProjectDetailToForm(data)
        this.currentStep = 1
        this.stepStatus = { 1: true, 2: true }
        uni.setNavigationBarTitle({ title: '编辑项目' })
        uni.showToast({ title: '已进入编辑', icon: 'success' })
      } catch (err) {
        console.error('加载项目失败', err)
        uni.showToast({ title: '加载失败', icon: 'none' })
      }
    },

    saveDraft() {
      if (this.editingProjectId) {
        uni.showToast({ title: '编辑已发布项目请使用「保存修改」', icon: 'none' })
        return
      }
      if (!this.form.name) {
        uni.showToast({ title: '请填写项目名称', icon: 'none' })
        return
      }

      const draftData = {
        wizard: 'v2',
        currentStep: this.currentStep,
        stepStatus: { 1: !!this.stepStatus[1], 2: !!this.stepStatus[2] },
        form: JSON.parse(JSON.stringify(this.form))
      }

      let drafts = uni.getStorageSync('projectDrafts') || []

      if (this.editingDraftId) {
        // 覆盖更新原有草稿
        drafts = drafts.map(d => 
          d.id === this.editingDraftId ? { ...d, ...draftData } : d
        )
        uni.showToast({ title: '草稿已更新', icon: 'success' })
      } else {
        // 新建草稿
        const newDraft = {
          id: Date.now(),
          title: this.form.name,
          ...draftData
        }
        drafts.unshift(newDraft)
        uni.showToast({ title: '草稿保存成功', icon: 'success' })
      }

      uni.setStorageSync('projectDrafts', drafts)

      // 清空表单
      setTimeout(() => {
        this.currentStep = 1
        this.stepStatus = { 1: false, 2: false }
        this.form = {
          name: '',
          desc: '',
          trackKind: 'dachuang',
          customTrack: '',
          apiStatus: 2,
          level: 1,
          tags: '',
          projectProgress: '',
          projectAttachmentFileId: null,
          projectAttachmentFileName: '',
          isAnonymous: false,
          contactInfo: '',
          deadlineDate: '',
          deadlineTime: '23:59',
          roles: [{ name: '', count: '', requirement: '' }]
        }
        this.editingDraftId = null
      }, 1500)
    },

    // ======================
    // ✅ 发布项目 → 自动删除草稿
    // ======================
    buildCreateOrUpdatePayload() {
      const deadlineRecruit = this.buildDeadlineRecruit()
      const roleRequirements = this.form.roles.map((item) => ({
        role: item.name,
        memberQuota: Number(item.count),
        recruitRequirements: item.requirement || ''
      }))
      const anon = !!this.form.isAnonymous
      const lv = Number(this.form.level)
      const st = this.normalizeStatusForForm(this.form.apiStatus)
      const progress = String(this.form.projectProgress || '').trim()
      const payload = {
        name: this.form.name.trim(),
        belongTrack: this.getBelongTrackPayload(),
        level: Number.isFinite(lv) && lv >= 1 && lv <= 3 ? lv : 1,
        projectIntro: this.form.desc,
        projectProgress: progress,
        progectProgress: progress,
        projectFeatures: '',
        tags: (this.form.tags || '').trim(),
        allowCrossMajor: true,
        isAnonymous: anon,
        contactInfo: anon ? String(this.form.contactInfo || '').trim() : '',
        deadlineRecruit,
        status: st,
        roleRequirements
      }
      if (this.form.projectAttachmentFileId) {
        payload.attachmentFileId = Number(this.form.projectAttachmentFileId)
        const n = String(this.form.projectAttachmentFileName || '').trim()
        if (n) payload.attachmentFileName = n
      }
      return payload
    },

    async submitProject() {
      const pass = await ensureStudentVerified('发布项目')
      if (!pass) return
      const v = this.validateForm()
      if (!v.ok) {
        uni.showToast({ title: v.msg, icon: 'none' })
        return
      }

      const isUpdate = !!this.editingProjectId
      const params = this.buildCreateOrUpdatePayload()

      if (!params.deadlineRecruit) {
        uni.showToast({ title: '请选择截止时间', icon: 'none' })
        return
      }

      try {
        if (isUpdate) {
          await api.updateProject(this.editingProjectId, params)
          uni.showToast({ title: '保存成功', icon: 'success' })
          uni.$emit('project:updated', { projectId: this.editingProjectId })
        } else {
          const res = await api.createProject(params)
          uni.showToast({ title: '发布成功', icon: 'success' })
          uni.$emit('project:created', res?.data || null)
          if (this.editingDraftId) {
            let drafts = uni.getStorageSync('projectDrafts') || []
            drafts = drafts.filter((d) => d.id !== this.editingDraftId)
            uni.setStorageSync('projectDrafts', drafts)
            this.editingDraftId = null
          }
        }

        setTimeout(() => {
          this.resetToNewProject()
          if (isUpdate) {
            uni.navigateTo({ url: '/pages/user/my-projects?type=launched' })
          } else {
            uni.switchTab({ url: '/pages/square/index' })
          }
        }, 600)
      } catch (err) {
        console.error(isUpdate ? '保存失败' : '发布失败', err)
        uni.showToast({
          title: err?.data?.message || err?.message || (isUpdate ? '保存失败' : '发布失败'),
          icon: 'none'
        })
      }
    },
  }
}
</script>

<style scoped>
.create-page {
  min-height: 100vh;
  background: #f5f7fb;
  padding-bottom: 120rpx;
}

.edit-back-row {
  display: flex;
  align-items: center;
  padding: 16rpx 24rpx 12rpx;
  background: #fff;
  border-bottom: 1rpx solid #e8e8ef;
}
.edit-back-icon {
  font-size: 44rpx;
  line-height: 1;
  color: #1677ff;
  margin-right: 4rpx;
  font-weight: 600;
}
.edit-back-text {
  font-size: 28rpx;
  color: #1677ff;
}

/* 步骤栏 */
.steps {
  display: flex;
  padding: 20rpx;
  background: #fff;
}
.step-item {
  flex: 1;
  text-align: center;
  padding: 20rpx;
  border-radius: 10rpx;
  font-size: 26rpx;
  color: #1677ff;
  background: #ffffff;
  border: 1rpx solid #1677ff;
  position: relative;
  margin: 0 5rpx;
}
.step-item.active {
  background: #1677ff;
  color: #fff;
}
.step-item.done {
  background: #1677ff;
  color: #fff;
}
.step-item.done text {
  margin-right: 8rpx;
}

/* 内容 */
.content {
  padding: 20rpx 0;
  height: calc(100vh - 300rpx);
}

/* 表单项 */
.form-item {
  margin-bottom: 30rpx;
}
.label {
  font-size: 28rpx;
  color: #333;
  margin-bottom: 10rpx;
  display: block;
}
.input, .textarea, .select {
  border: 1rpx solid #eee;
  border-radius: 8rpx;
  padding: 0 20rpx;
  font-size: 28rpx;
  line-height: 80rpx;
  background: #fff;
}
.textarea {
  min-height: 120rpx;
  line-height: 1.5;
  padding: 20rpx;
}
.select {
  color: #666;
}

.input {
	height:40px;
	width: 100%;
	padding: 0 12px;
	box-sizing: border-box;
	
	border: 1px solid #ddd;
	border-radius: 4px; 
	outline: none;
}

.deadline-pickers {
  display: flex;
  gap: 12px;
}

.picker-value {
  height: 40px;
  line-height: 40px;
  padding: 0 12px;
  box-sizing: border-box;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: #fff;
  color: #333;
}

.req {
  color: #ff4d4f;
  margin-left: 4px;
}
/* 开关样式 */
.switch-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.switch {
  width: 80rpx;
  height: 40rpx;
  border-radius: 20rpx;
  background: #ccc;
  position: relative;
}
.switch.on {
  background: #1677ff;
}
.switch-circle {
  width: 36rpx;
  height: 36rpx;
  border-radius: 50%;
  background: #fff;
  position: absolute;
  top: 2rpx;
  left: 2rpx;
  transition: all 0.3s;
}
.switch.on .switch-circle {
  left: 42rpx;
}

/* 添加按钮 */
.add-row {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 20rpx;
}
.add-btn {
  font-size: 24rpx;
  padding: 10rpx 20rpx;
  background: #1677ff;
  color: #fff;
  border-radius: 8rpx;
}

/* 预览页面样式 */
.preview-title {
  font-size: 48rpx;
  font-weight: bold;
  margin-bottom: 20rpx;
}
.preview-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 20rpx;
  margin-bottom: 30rpx;
}
.tag {
  padding: 8rpx 20rpx;
  border-radius: 20rpx;
  font-size: 24rpx;
}
.tag-type {
  background: #e6f2ff;
  color: #1677ff;
}
.tag-status {
  background: #f0f9eb;
  color: #67c23a;
}
.tag-level {
  background: #fff7e6;
  color: #d48806;
}
.tag-ptype {
  background: #f9f0ff;
  color: #722ed1;
}
.preview-features,
.preview-tags-line {
  font-size: 26rpx;
  color: #555;
  line-height: 1.5;
  margin-bottom: 16rpx;
}
.preview-anon {
  font-size: 26rpx;
  color: #d48806;
  margin-bottom: 20rpx;
}
.preview-desc {
  font-size: 28rpx;
  color: #333;
  line-height: 1.6;
  margin-bottom: 40rpx;
}
.recruit-section {
  border-top: 1rpx dashed #ccc;
  padding-top: 30rpx;
}
.recruit-title {
  font-size: 32rpx;
  font-weight: bold;
  margin-bottom: 20rpx;
}
.recruit-deadline {
  font-size: 28rpx;
  margin-bottom: 30rpx;
}
.role-item {
  border: 1rpx solid #eee;
  border-radius: 8rpx;
  margin-bottom: 20rpx;
}
.role-header {
  display: flex;
  justify-content: space-between;
  padding: 20rpx;
  background: #f5f5f5;
  font-size: 28rpx;
}
.arrow {
  color: #999;
}
.role-req {
  padding: 20rpx;
  font-size: 26rpx;
  color: #666;
}

/* 底部固定按钮 */
.footer {
  position: fixed;
  left: -10px;
  bottom: 48px;
  width: 100%;
  display: flex;
  padding: 20rpx;
  background: #fff;
  box-shadow: 0 -2rpx 10rpx rgba(0,0,0,0.05);
}
.btn {
  flex: 1;
  height: 80rpx;
  line-height: 80rpx;
  border-radius: 10rpx;
  font-size: 30rpx;
  margin: 0 10rpx;
}
.draft {
  background: #f5f5f5;
  color: #666;
}
.next {
  background: #1677ff;
  color: #fff;
}

.tag-quick-row {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx 16rpx;
  margin-bottom: 20rpx;
}
.quick-tag {
  font-size: 24rpx;
  padding: 8rpx 18rpx;
  border-radius: 999rpx;
  border: 1rpx solid #d0d7de;
  color: #555;
  background: #fff;
}
.quick-tag--on {
  border-color: #1677ff;
  background: #e6f4ff;
  color: #1677ff;
  font-weight: 600;
}
.role-group-head,
.role-req-head {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12rpx;
}
.role-group-title {
  font-size: 26rpx;
  font-weight: 600;
  color: #333;
}
.role-remove {
  font-size: 24rpx;
  color: #ff4d4f;
  padding: 8rpx 12rpx;
}
.role-req-block {
  padding-bottom: 8rpx;
  border-bottom: 1rpx solid #f0f0f0;
  margin-bottom: 20rpx;
}
.role-req-block:last-child {
  border-bottom: none;
  margin-bottom: 0;
}
.upload-attach-trigger {
  display: flex;
  flex-direction: row;
  align-items: center;
  min-height: 80rpx;
  padding: 16rpx 20rpx;
  border: 1rpx solid #eee;
  border-radius: 8rpx;
  background: #fff;
  box-sizing: border-box;
}
.upload-attach-value {
  flex: 1;
  min-width: 0;
  font-size: 28rpx;
  color: #333;
  line-height: 1.4;
  word-break: break-all;
  padding-right: 16rpx;
}
.upload-attach-placeholder {
  flex: 1;
  font-size: 28rpx;
  color: #999;
  padding-right: 16rpx;
}
.upload-attach-link {
  flex-shrink: 0;
  font-size: 28rpx;
  color: #1677ff;
  font-weight: 500;
}
.upload-attach-del {
  flex-shrink: 0;
  font-size: 26rpx;
  color: #ff4d4f;
  padding: 8rpx 4rpx 8rpx 16rpx;
}
</style>