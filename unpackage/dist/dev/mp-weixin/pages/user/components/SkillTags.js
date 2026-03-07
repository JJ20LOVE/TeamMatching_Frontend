"use strict";
const common_vendor = require("../../../common/vendor.js");
const _sfc_main = {
  name: "SkillTags",
  props: {
    skills: {
      type: Array,
      default: () => []
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.f($props.skills, (skill, index, i0) => {
      return {
        a: common_vendor.t(skill),
        b: index
      };
    }),
    b: common_vendor.o(($event) => _ctx.$emit("add")),
    c: common_vendor.o(($event) => _ctx.$emit("add"))
  };
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../../.sourcemap/mp-weixin/pages/user/components/SkillTags.js.map
