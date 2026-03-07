"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      type: "launched",
      launchedList: [
        { title: "基于AI的校园组队平台" },
        { title: "何意味" }
      ],
      joinedList: [
        { title: "基于校园的AI组队平台", status: "pending", statusText: "申请中" },
        { title: "项目二", status: "passed", statusText: "已通过" },
        { title: "项目三", status: "rejected", statusText: "被拒" }
      ]
    };
  },
  onLoad(options) {
    if (options && options.type) {
      this.type = options.type;
    }
    this.updateTitle();
  },
  methods: {
    updateTitle() {
      let title = "我的项目";
      if (this.type === "launched")
        title = "我发起的项目";
      else if (this.type === "joined")
        title = "我加入的项目";
      else if (this.type === "draft")
        title = "草稿箱";
      common_vendor.index.setNavigationBarTitle({ title });
    },
    onCreateProject() {
      common_vendor.index.showToast({
        title: "跳转到创建项目页（待接入）",
        icon: "none"
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.type === "launched"
  }, $data.type === "launched" ? {
    b: common_vendor.f($data.launchedList, (item, index, i0) => {
      return {
        a: common_vendor.t(item.title),
        b: index
      };
    }),
    c: common_vendor.o((...args) => $options.onCreateProject && $options.onCreateProject(...args))
  } : $data.type === "joined" ? {
    e: common_vendor.f($data.joinedList, (item, index, i0) => {
      return {
        a: common_vendor.t(item.title),
        b: common_vendor.t(item.statusText),
        c: index,
        d: common_vendor.n(`status-${item.status}`)
      };
    })
  } : {}, {
    d: $data.type === "joined"
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/user/my-projects.js.map
