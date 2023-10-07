<template>
  <div class="video">
    <el-row :gutter="20">
      <el-col
        :span="4"
        style="
          height: calc(100vh - 100px);
          overflow-y: auto;
          box-shadow: 0 0 25px #cac6c6;
        "
        ><div class="grid-content bg-purple">
          <div class="data-status">
            <div
              :class="index == selectIndex ? 'area-item-select' : 'area-item'"
              v-for="(item, index) in statusData"
              :key="index"
            >
              <div @click="changeStatus(index)">{{ item.name }}</div>
            </div>
          </div>
          <el-menu
            v-if="isSingle"
            default-active="2"
            class="el-menu-vertical-demo"
            @open="handleOpen"
            @close="handleClose"
          >
            <el-submenu
              v-for="item in singleList"
              :index="item.name"
              :key="item.name"
            >
              <template slot="title">
                <span>{{ item.name }}</span>
              </template>
              <el-menu-item-group>
                <el-menu-item
                  :disabled="!subItem.status"
                  @click="clickMenu(subItem.deviceSerial, 1)"
                  v-for="subItem in item.list"
                  :index="subItem.id"
                  :key="subItem.id"
                  >{{ subItem.deviceName }}</el-menu-item
                >
              </el-menu-item-group>
            </el-submenu>
          </el-menu>
          <el-menu
            v-else
            default-active="2"
            class="el-menu-vertical-demo"
            @open="handleOpen"
            @close="handleClose"
          >
            <el-submenu
              v-for="item in doubleList"
              :index="item.name"
              :key="item.name"
            >
              <template slot="title">
                <span>{{ item.name }}</span>
              </template>
              <el-menu-item-group>
                <el-submenu
                  v-for="subItem in item.list"
                  :index="subItem.id"
                  :key="subItem.id"
                >
                  <template slot="title">{{ subItem.deviceName }}</template>
                  <!-- {{ subItem.list }} -->
                  <el-menu-item
                    :disabled="subItemItem.status === 1 ? false : true"
                    v-for="(subItemItem, index) in subItem.list"
                    @click="clickMenu(subItemItem.deviceSerial, index + 1)"
                    :index="subItemItem.deviceSerial + index"
                    :key="subItemItem.deviceSerial + index"
                    >{{ subItemItem.deviceName + (index + 1) }}</el-menu-item
                  >
                </el-submenu>
                <!-- <el-menu-item
                  @click="clickMenu(subItem.deviceSerial)"
                  v-for="subItem in item.list"
                  :index="subItem.id"
                  :key="subItem.id"
                  >{{ subItem.deviceName }}</el-menu-item
                > -->
              </el-menu-item-group>
            </el-submenu>
          </el-menu>
        </div></el-col
      >

      <el-col :span="20" style="height: calc(100vh - 100px)"
        ><div class="grid-content bg-purple-light">
          <div class="frame-list">
            <!-- <div
              id="item123"
              :style="{
                width: childWidth + 'px',
                height: childHeight + 'px',
              }"
            ></div> -->
            <div
              v-for="(item, index) in frameList"
              :key="index"
              :id="item.id"
              :style="{
                width: childWidth + 'px',
                height: childHeight + 'px',
              }"
              style="position: relative; border: 1px solid #000"
            >
              <div
                :style="{
                  width: childWidth + 'px',
                  height: childHeight + 'px',
                }"
              ></div>
              <div class="top-close" @click="closeVideo(index)">X</div>
            </div>
          </div>
        </div>
        <div class="change-num">
          <div class="first" @click="changeNum(1)">1</div>
          <div class="forth" @click="changeNum(4)">4</div>
          <div class="ninth" @click="changeNum(9)">9</div>
        </div></el-col
      >
    </el-row>
  </div>
</template>

<script>
import { getEzvizToken, getCameraList, getLiveAddress } from "@/api/video/live";
import {
  getWorksiteDeviceList,
  getWorksiteDeviceList2,
  getAllDeviceList,
  getVideoDeviceList,
} from "@/api/video/location";
import EZUIKit from "ezuikit-js";

export default {
  data() {
    return {
      // 工地
      singleList: [],
      doubleList: [],
      // 工地下监控
      sSiteList: [],
      dSiteList: [],
      dSubList: [],
      // 右侧view框
      frameList: [],
      // 单通道及多通道
      statusData: [
        { name: "单通道", value: 0 },
        { name: "多通道", value: 1 },
      ],
      selectIndex: 0,
      isSingle: true,

      // 萤石云token
      accessToken: "",
      EZOPENDemo: "",
      ezopenUrl: "",
      childWidth: 450,
      childHeight: 300,
      screenIndex: 4,
      videoPlayer: [],
    };
  },
  created() {
    // window.EZOPENDemo = this.EZOPENDemo;
  },
  mounted() {
    // 右侧view框初始化
    this.initArray(4);

    this.getEzvizToken();
    this.getAllDeviceList();
    this.getVideoDeviceList();
  },
  methods: {
    // 获取萤石云token
    getEzvizToken() {
      getEzvizToken().then((response) => {
        console.log("getEzvizToken", response);
        this.accessToken = response.msg;
      });
    },
    // 获取设备通道列表
    getCameraList(data) {
      getCameraList(data).then((response) => {
        console.log("getCameraList", response);
      });
    },
    // 获取播放地址
    getLiveAddress(deviceSerial, channelNo) {
      getLiveAddress(deviceSerial, channelNo).then((response) => {
        console.log("getLiveAddress", response);
        this.ezopenUrl = response.msg;
        console.log(deviceSerial + channelNo, channelNo, typeof channelNo);
        this.ezopenInit(deviceSerial + channelNo);
      });
    },

    // 监控初始化
    ezopenInit(id) {
      for (let i = 0; i < this.screenIndex; i++) {
        this.videoPlayer[i] = new EZUIKit.EZUIKitPlayer({
          id: id,
          // id: "item123",
          width: this.childWidth,
          height: this.childHeight,
          template: "pcLive",
          url: this.ezopenUrl,
          accessToken: this.accessToken,
          audio: 0,
        });
      }
      // this.EZOPENDemo = new EZUIKit.EZUIKitPlayer({
      //   id: id,
      //   // id: "item123",
      //   width: this.childWidth,
      //   height: this.childHeight,
      //   template: "pcLive",
      //   url: this.ezopenUrl,
      //   accessToken: this.accessToken,
      //   audio: 0,
      // });
      // window.EZOPENDemo = this.EZOPENDemo;
      // console.log("epozen初始化", this.EZOPENDemo);
    },

    // 点击进行状态筛选
    changeStatus(index) {
      console.log(index);
      if (this.EZOPENDemo) {
        this.EZOPENDemo.stop();
        // this.EZOPENDemo.destroy();
      }
      switch (index) {
        case 0:
          this.isSingle = true;
          break;
        case 1:
          this.isSingle = false;
          break;
      }
      this.selectIndex = index;
    },

    //右侧view框初始化
    // 创建数组
    initArray(index) {
      this.frameList = new Array(index);
      this.videoPlayer = new Array(index);
      for (let i = 0; i < index; i++) {
        this.frameList[i] = { id: "" };
        this.videoPlayer[i] = "videoPlayer" + index;
      }
      console.log("this.videoPlayer", this.videoPlayer);
    },

    // 获取工地设备列表(分页)
    getWorksiteDeviceList() {
      getWorksiteDeviceList().then((response) => {
        console.log("getWorksiteDeviceList", response);
      });
    },
    // 获取工地设备列表(不分页)
    getWorksiteDeviceList2() {
      getWorksiteDeviceList2().then((response) => {
        console.log("getWorksiteDeviceList2", response);
      });
    },
    // 获取全部设备(分页)
    getAllDeviceList() {
      getAllDeviceList().then((response) => {
        console.log("getAllDeviceList", response);
      });
    },

    // 获取设备播放地址列表
    getVideoDeviceList() {
      getVideoDeviceList().then((response) => {
        console.log("getVideoDeviceList", response);
        this.singleList = response.data.slist;
        this.doubleList = response.data.dlist;
        // 工地下的监控列表
        this.sSiteList = this.singleList.list;
        this.dSiteList = this.singleList.list;
      });
    },
    // 左侧栏
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
    // 点击左侧获取视频地址
    clickMenu(item, channelNo) {
      console.log("clickMenu", item, typeof item);
      let data = { deviceSerial: item };
      console.log("channelNo", channelNo);
      // this.frameList = JSON.parse(JSON.stringify(this.frameList));
      for (let i = 0; i < this.screenIndex; i++) {
        // console.error(i, this.frameList[i].id);
        if (this.frameList[i].id == "") {
          // console.error(i, this.frameList[i].id);
          this.$set(this.frameList, i, { id: item + channelNo });
          console.log("this.frameList", this.frameList);
          // document
          //   .getElementById(this.frameList[i].id)
          //   .firstChild.setAttribute("id", this.frameList[i].id + "-video");
          // setTimeout(() => {
          //   console.log(document.getElementById(this.frameList[i]));
          // }, 1000);
          const sendId = item + channelNo;
          console.log("sendId", sendId);
          this.getLiveAddress(item, Number(channelNo));
          return;
        }
      }
      alert("超出长度");
    },

    // 点击X关闭视频
    closeVideo(index) {
      console.log("closeVideo", index);
      const closeIndex = document.getElementById(
        `${this.frameList[index].id}-wrap`
      );
      closeIndex.innerHTML = "";
      //closeIndex.id = "";
      this.$set(this.frameList, index, { id: "" });
      console.log("closeVideo-frameList", this.frameList);
    },

    // 点击右下角切换视图数量
    changeNum(index) {
      switch (index) {
        case 1:
          (this.childWidth = 900), (this.childHeight = 600);
          break;
        case 4:
          (this.childWidth = 450), (this.childHeight = 300);
          break;
        case 9:
          (this.childWidth = 300), (this.childHeight = 200);
          break;
      }
      // this.getLiveAddress(this.deviceSerial, this.id);
      // this.ezopenInit();
      this.screenIndex = index;
      this.initArray(index);
    },
  },
};
</script>

<style scoped>
.select-channel {
  display: flex;
}
.frame-list {
  width: 910px;
  display: flex;
  flex-flow: row wrap;
}

.data-status {
  /* height: 60px;
     line-height: 60px; */
  display: flex;
  align-items: center;
  padding: 0 20px;
}
.status-item {
  padding-right: 30px;
}
.area-item {
  padding: 10px;
  border-radius: 10px;
  margin-right: 10px;
  margin-bottom: 10px;
}
.area-item-select {
  padding: 10px;
  border-radius: 10px;
  /* border: 1px solid #00a5bd; */
  border: 1px solid #409eff;
  /* color: #00a5bd; */
  color: #409eff;
  margin-right: px;
  margin-bottom: 10px;
}
.top-close {
  position: absolute;
  top: 1%;
  right: 1%;
  color: #fff;
  z-index: 999;
}
.change-num {
  position: absolute;
  bottom: 20px;
  right: 20px;
  display: flex;
}
.change-num div {
  padding: 4px 10px;
  border: 1px solid #000;
  margin-left: 8px;
}
</style>
