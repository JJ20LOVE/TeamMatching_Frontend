"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      status: "passed",
      // pending / passed / rejected
      form: {
        name: "张伟",
        studentId: "102XXXXXXX",
        campusEmail: "xxx@stu.ecnu.cn"
      }
    };
  },
  computed: {
    statusText() {
      if (this.status === "passed")
        return "已通过";
      if (this.status === "pending")
        return "审核中";
      return "未通过";
    }
  },
  methods: {
    onSubmit() {
      this.status = "pending";
      common_vendor.index.showToast({
        title: "已提交，等待审核",
        icon: "none"
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.t($options.statusText),
    b: common_vendor.n(`status-${$data.status}`),
    c: $data.form.name,
    d: common_vendor.o(($event) => $data.form.name = $event.detail.value),
    e: $data.form.studentId,
    f: common_vendor.o(($event) => $data.form.studentId = $event.detail.value),
    g: $data.form.campusEmail,
    h: common_vendor.o(($event) => $data.form.campusEmail = $event.detail.value),
    i: common_vendor.o((...args) => $options.onSubmit && $options.onSubmit(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/user/auth.js.map
