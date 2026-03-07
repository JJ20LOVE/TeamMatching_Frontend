"use strict";
const common_vendor = require("../common/vendor.js");
const _sfc_main = {
  name: "SettingItem",
  props: {
    label: {
      type: String,
      required: true
    },
    badge: {
      type: String,
      default: ""
    },
    switchable: {
      type: Boolean,
      default: false
    },
    switchValue: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    handleClick() {
      if (!this.switchable) {
        this.$emit("click");
      }
    },
    handleSwitchChange(e) {
      this.$emit("update:switchValue", e.detail.value);
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.t($props.label),
    b: $props.badge
  }, $props.badge ? {
    c: common_vendor.t($props.badge)
  } : $props.switchable ? {
    e: $props.switchValue,
    f: common_vendor.o((...args) => $options.handleSwitchChange && $options.handleSwitchChange(...args))
  } : {}, {
    d: $props.switchable,
    g: common_vendor.o((...args) => $options.handleClick && $options.handleClick(...args))
  });
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-779b322e"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../.sourcemap/mp-weixin/components/SettingItem.js.map
