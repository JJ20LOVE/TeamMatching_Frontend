"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      form: {
        name: "王小明",
        grade: "25级",
        college: "软件工程学院",
        bio: ""
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
    onSave() {
      common_vendor.index.showToast({
        title: "已保存",
        icon: "success"
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.o((...args) => $options.onUploadAvatar && $options.onUploadAvatar(...args)),
    b: $data.form.name,
    c: common_vendor.o(($event) => $data.form.name = $event.detail.value),
    d: $data.form.grade,
    e: common_vendor.o(($event) => $data.form.grade = $event.detail.value),
    f: $data.form.college,
    g: common_vendor.o(($event) => $data.form.college = $event.detail.value),
    h: $data.form.bio,
    i: common_vendor.o(($event) => $data.form.bio = $event.detail.value),
    j: common_vendor.o((...args) => $options.onSave && $options.onSave(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/user/profile.js.map
