"use strict";
const common_vendor = require("../../common/vendor.js");
const UserInfo = () => "./components/UserInfo.js";
const SkillTags = () => "./components/SkillTags.js";
const _sfc_main = {
  components: {
    UserInfo,
    SkillTags
  },
  data() {
    return {
      userInfo: {
        name: "王小明",
        grade: "25级",
        college: "软件工程学院"
      },
      authInfo: {
        name: "张伟",
        studentId: "102XXXXXXX",
        campusEmail: "xxx@stu.ecnu.cn"
      },
      skills: ["Python", "Vue.js", "Rust"],
      showAuthInfo: false,
      showSkillModal: false,
      skillForm: {
        stack: "",
        experience: ""
      }
    };
  },
  methods: {
    onUploadAvatar() {
      common_vendor.index.showToast({
        title: "上传头像功能待接入",
        icon: "none"
      });
    },
    goProfile() {
      common_vendor.index.navigateTo({
        url: "/pages/user/profile"
      });
    },
    openAuthInfo() {
      this.showAuthInfo = true;
    },
    closeAuthInfo() {
      this.showAuthInfo = false;
    },
    openSkillModal() {
      this.skillForm.stack = "";
      this.skillForm.experience = "";
      this.showSkillModal = true;
    },
    closeSkillModal() {
      this.showSkillModal = false;
    },
    confirmAddSkill() {
      const value = this.skillForm.stack && this.skillForm.stack.trim();
      if (!value) {
        common_vendor.index.showToast({
          title: "请先填写技术栈",
          icon: "none"
        });
        return;
      }
      this.skills.push(value);
      this.closeSkillModal();
    },
    goMyProjects(type) {
      common_vendor.index.navigateTo({
        url: `/pages/user/my-projects?type=${type}`
      });
    },
    goSettings() {
      common_vendor.index.showToast({
        title: "系统设置功能即将上线",
        icon: "none",
        duration: 1500
      });
    },
    goFeedback() {
      common_vendor.index.navigateTo({
        url: "/pages/user/feedback"
      });
    }
  }
};
if (!Array) {
  const _component_UserInfo = common_vendor.resolveComponent("UserInfo");
  const _component_SkillTags = common_vendor.resolveComponent("SkillTags");
  (_component_UserInfo + _component_SkillTags)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.o($options.onUploadAvatar),
    b: common_vendor.o($options.goProfile),
    c: common_vendor.o($options.openAuthInfo),
    d: common_vendor.p({
      ["user-info"]: $data.userInfo
    }),
    e: common_vendor.o(($event) => $options.goMyProjects("launched")),
    f: common_vendor.o(($event) => $options.goMyProjects("joined")),
    g: common_vendor.o($options.openSkillModal),
    h: common_vendor.p({
      skills: $data.skills
    }),
    i: common_vendor.o((...args) => $options.goSettings && $options.goSettings(...args)),
    j: common_vendor.o((...args) => $options.goFeedback && $options.goFeedback(...args)),
    k: $data.showAuthInfo
  }, $data.showAuthInfo ? {
    l: common_vendor.o((...args) => $options.closeAuthInfo && $options.closeAuthInfo(...args)),
    m: common_vendor.t($data.authInfo.name),
    n: common_vendor.t($data.authInfo.studentId),
    o: common_vendor.t($data.authInfo.campusEmail),
    p: common_vendor.o(() => {
    }),
    q: common_vendor.o((...args) => $options.closeAuthInfo && $options.closeAuthInfo(...args))
  } : {}, {
    r: $data.showSkillModal
  }, $data.showSkillModal ? {
    s: common_vendor.o((...args) => $options.closeSkillModal && $options.closeSkillModal(...args)),
    t: $data.skillForm.stack,
    v: common_vendor.o(($event) => $data.skillForm.stack = $event.detail.value),
    w: $data.skillForm.experience,
    x: common_vendor.o(($event) => $data.skillForm.experience = $event.detail.value),
    y: common_vendor.o((...args) => $options.closeSkillModal && $options.closeSkillModal(...args)),
    z: common_vendor.o((...args) => $options.confirmAddSkill && $options.confirmAddSkill(...args)),
    A: common_vendor.o(() => {
    }),
    B: common_vendor.o((...args) => $options.closeSkillModal && $options.closeSkillModal(...args))
  } : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/user/index.js.map
