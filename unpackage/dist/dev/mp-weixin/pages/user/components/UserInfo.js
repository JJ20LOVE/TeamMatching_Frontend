"use strict";
const common_vendor = require("../../../common/vendor.js");
const AuthStatus = () => "./AuthStatus.js";
const _sfc_main = {
  name: "UserInfo",
  components: {
    AuthStatus
  },
  props: {
    userInfo: {
      type: Object,
      default: () => ({})
    }
  }
};
if (!Array) {
  const _component_AuthStatus = common_vendor.resolveComponent("AuthStatus");
  _component_AuthStatus();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.o(($event) => _ctx.$emit("upload-avatar")),
    b: common_vendor.t($props.userInfo.name),
    c: common_vendor.o(($event) => _ctx.$emit("edit")),
    d: common_vendor.t($props.userInfo.grade),
    e: common_vendor.t($props.userInfo.college),
    f: common_vendor.o(($event) => _ctx.$emit("show-auth"))
  };
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-3a5e9b15"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/user/components/UserInfo.js.map
