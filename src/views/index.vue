<template>
  <div class="app-container home">
    <!-- :toLnglats="addressData"
      :statusValue="statusValue"
      @makerClick="makerClick" -->
    <common-map :toLnglats="addressData" @makerClick="makerClick"></common-map>
    <!-- <el-row :gutter="20">
      <el-col :sm="24" :lg="24">  </el-col>
    </el-row> -->
  </div>
</template>

<script>
import CommonMap from "@/components/Map/CommonMap.vue";
import { getWorksiteList2 } from "@/api/video/location";
export default {
  name: "Index",
  data() {
    return {
      // 版本号
      version: "3.8.6",
      addressData: [],
    };
  },
  components: { CommonMap },
  mounted() {
    this.getWorksiteList2();
  },
  methods: {
    goTarget(href) {
      window.open(href, "_blank");
    },
    // 获取设备列表(不分页)
    getWorksiteList2() {
      getWorksiteList2().then((response) => {
        console.log("getWorksiteList2", response);
        this.addressData = response.data;
        // this.addressData = response.data.map((item) => {
        //   console.log("getWorksiteList2-map", item);
        //   return item.location;
        // });
        console.log("this.addressData", this.addressData);
      });
    },

    makerClick(deviceId) {
      // this.dialogVisible = true;
      // this.deviceId = deviceId;
      // console.log("this.deviceId", this.deviceId);
      // // 大屏弹窗数据
      // this.getPopupData();
      // this.getStatus();
      // console.log(1111111, deviceId);
      // this.goDetail(deviceId);
    },
  },
};
</script>

<style scoped lang="scss">
.home {
  width: 100%;
  height: 100%;
  // border-radius: 20px;
  // border: 1px solid #000;
  blockquote {
    padding: 10px 20px;
    margin: 0 0 20px;
    font-size: 17.5px;
    border-left: 5px solid #eee;
  }
  hr {
    margin-top: 20px;
    margin-bottom: 20px;
    border: 0;
    border-top: 1px solid #eee;
  }
  .col-item {
    margin-bottom: 20px;
  }

  ul {
    padding: 0;
    margin: 0;
  }

  font-family: "open sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 13px;
  color: #676a6c;
  overflow-x: hidden;

  ul {
    list-style-type: none;
  }

  h4 {
    margin-top: 0px;
  }

  h2 {
    margin-top: 10px;
    font-size: 26px;
    font-weight: 100;
  }

  p {
    margin-top: 10px;

    b {
      font-weight: 700;
    }
  }

  .update-log {
    ol {
      display: block;
      list-style-type: decimal;
      margin-block-start: 1em;
      margin-block-end: 1em;
      margin-inline-start: 0;
      margin-inline-end: 0;
      padding-inline-start: 40px;
    }
  }
}
</style>
