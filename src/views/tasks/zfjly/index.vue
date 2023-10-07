<template>
  <div>
    <el-form
      :model="queryParams"
      ref="queryForm"
      size="small"
      :inline="true"
      v-show="showSearch"
    >
      <el-form-item label="设备序列号" prop="deviceSerial">
        <el-select
          v-model="queryParams.deviceSerial"
          placeholder="设备序列号"
          clearable
        >
          <el-option
            v-for="item in deviceList"
            :key="item.deviceSerial"
            :label="item.deviceSerial"
            :value="item.deviceSerial"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-date-picker
          v-model="value1"
          value-format="yyyy-MM-dd HH:mm:ss"
          type="date"
          placeholder="选择日期"
          :picker-options="pickerOptions"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery"
          >搜索</el-button
        >
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
          >重置</el-button
        >
      </el-form-item>
    </el-form>
    <el-row :gutter="20">
      <el-col
        :span="4"
        style="
          height: calc(100vh - 150px);
          overflow-y: auto;
          box-shadow: 0 0 25px #cac6c6;
        "
      >
        <div class="grid-content bg-purple" v-if="!noList">
          <el-menu
            default-active="2"
            class="el-menu-vertical-demo"
            @open="handleOpen"
            @close="handleClose"
          >
            <el-menu-item
              v-for="item in recordList"
              :index="item.createTime"
              :key="item.createTime"
              @click="selectDevice(item.inspectRecordId)"
            >
              <template slot="title">
                <span>事件:</span>
                <span>{{ item.createTime }}-</span>
                <span>{{ item.endTime }}</span>
              </template>
            </el-menu-item>
          </el-menu>
        </div>
        <div v-else>暂无数据</div>
      </el-col>

      <el-col :span="20" style="height: calc(100vh - 150px)">
        <div
          class="grid-content bg-purple-light"
          style="position: relative; width: 100%; height: 100%"
        >
          <div
            class="amap-wrapper"
            v-if="isSelect"
            style="width: 100%; height: 100%; border: 1px solid #000"
          >
            <div
              class="monitor-display"
              :style="{
                width: childWidth + 'px',
                height: childHeight + 'px',
              }"
            >
              <div
                id="item123"
                :style="{
                  width: childWidth + 'px',
                  height: childHeight + 'px',
                }"
              ></div>
            </div>

            <!-- 高德地图 -->
            <!-- @complete="mapLoading" -->
            <amap ref="myMap" :center="center" :zoom="zoom">
              <!-- 左上角旋转工具 -->
              <amap-tool-bar />
              <!-- 右下角缩放工具 -->
              <amap-control-bar
                :position="{
                  top: '10px',
                  left: '10px',
                }"
              />
              <!-- 起点标志位置 -->
              <amap-marker ref="myMarker1" :position="position1" />
              <amap-text
                :position="position1"
                :text="text1"
                :dom-style="{
                  color: '#00A5BD',
                }"
              />
              <!-- 终点标志 -->
              <amap-marker ref="myMarker2" :position="position2" />
              <amap-text
                :position="position2"
                :text="text2"
                :dom-style="{
                  color: '#00A5BD',
                }"
              />
              <!-- 轨迹 -->
              <amap-polyline
                :stroke-weight="8"
                :path="path"
                stroke-color="#00A5BD"
              />
              <!-- 时间标志点 -->
              <amap-marker
                v-for="(item, key) in locationDetails"
                :key="key"
                :icon="iconimg"
                :offset="[0, -10]"
                :position.sync="item.path"
                clickable
                @mouseover="showMouseover(item)"
              />
              <!-- 时间信息层 -->
              <amap-info-window
                :visible="!!coordinatesData"
                :position="coordinatesData ? coordinatesData.path : null"
                :offset="[10, -8]"
                auto-move
                is-custom
              >
                <div v-if="coordinatesData">
                  <div v-show="coordinatesTo">
                    <div class="parcel">
                      <i
                        class="el-icon-close"
                        @click="coordinatesData = null"
                      ></i>
                      <div class="text_li_css" style="padding-top: 30px">
                        时间：{{ coordinatesData.gtm }}
                      </div>
                      <div class="text_li_css">
                        经度：{{ coordinatesData.path[0] }}
                      </div>
                      <div class="text_li_css">
                        维度：{{ coordinatesData.path[1] }}
                      </div>
                    </div>
                    <div class="mark_css"></div>
                  </div>
                </div>
              </amap-info-window>
            </amap>
          </div>
          <div v-else-if="noRecord && !isSelect">暂无轨迹</div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getInspectList, getInspectTrace } from "@/api/video/tasks";
import { getEzvizToken, getLiveAddress } from "@/api/video/live";
import { getAllDeviceList } from "@/api/video/location";
import EZUIKit from "ezuikit-js";
import iconimg from "@/assets/logo/logo.png";
import Amap from "@amap/amap-vue/lib/amap";
import AmapMarker from "@amap/amap-vue/lib/marker";
import AmapText from "@amap/amap-vue/lib/text";
import AmapPolyline from "@amap/amap-vue/lib/polyline";
import AmapControlBar from "@amap/amap-vue/lib/control-bar";
import AmapToolBar from "@amap/amap-vue/lib/tool-bar";
import AmapInfoWindow from "@amap/amap-vue/lib/info-window";
// import commonLine from "./components/commonLine.vue";
// import { filter } from "vue/types/umd";

export default {
  data() {
    return {
      // 选择日期
      value1: "",
      value2: "",
      noList: false,
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
      },
      // 查询参数
      queryParams: {
        deviceSerial: undefined,
        startTime: this.value1,
        endTime: this.value2,
        // status: undefined,
      },
      showSearch: true,
      deviceList: [],
      recordList: [],
      newParams: { pageNum: 1, pageSize: 10, keyword: "", type: "1" },
      isSelect: false,
      noRecord: false,
      locationData: {},
      locationData1: [],

      // 萤石云token
      accessToken: "",
      EZOPENDemo: "",
      ezopenUrl: "",
      childWidth: 450,
      childHeight: 300,

      //引入的时间标志图标
      iconimg,
      //时间标志位置数据
      locationDetails: [],
      //时间信息层坐标位置
      coordinatesData: { path: [120.23572, 31.52262], gtm: "" },
      //   coordinatesData: { path: [116.397447, 39.909183], gtm: "" },
      //时间信息层初始隐藏
      coordinatesTo: false,
      //地图显示坐标位置
      center: [],
      //地图初始缩放等级
      zoom: 18,
      //起点标志位置
      position1: [0, 0],
      text1: "起点位置",
      //终点标志位置
      position2: [0, 0],
      text2: "终点位置",
      //轨迹坐标数据
      path: [],
    };
  },
  components: {
    Amap,
    AmapMarker,
    AmapText,
    AmapPolyline,
    AmapControlBar,
    AmapToolBar,
    AmapInfoWindow,
  },

  created() {
    window.EZOPENDemo = this.EZOPENDemo;
  },
  mounted() {
    this.getAllDeviceList();
    this.getEzvizToken();
  },

  methods: {
    // 获取全部设备(分页)
    getAllDeviceList() {
      let formData = new FormData();
      formData.append("pageNum", this.newParams.pageNum);
      formData.append("pageSize", this.newParams.pageSize);
      formData.append("keyword", this.newParams.keyword);
      formData.append("type", this.newParams.type);

      getAllDeviceList(formData).then((response) => {
        console.log("getAllDeviceList", response);
        this.deviceList = response.rows;
      });
    },

    // 获取巡检记录列表
    fetchInspectList() {
      let formData = new FormData();
      formData.append("deviceSerial", this.queryParams.deviceSerial);
      formData.append("startTime", this.value1);
      formData.append("endTime", this.value2);
      console.log("fetchInspectList", this.queryParams);
      getInspectList(formData).then((response) => {
        if (response.data == null) {
          this.noList = true;
          console.log("nolist");
        } else {
          this.noList = false;
          this.recordList = response.data.map((element) => {
            element.createTime = element.createTime.substr(11, 30);
            element.endTime = element.endTime.substr(11, 30);
            return element;
          });
          // this.recordList = response.data;
          console.log("response.data", this.recordList);
        }
      });
    },

    // 获取巡检轨迹
    fetchInspectTrace(inspectRecordId) {
      let formData = new FormData();
      formData.append("inspectRecordId", inspectRecordId);
      getInspectTrace(formData).then((response) => {
        console.log("fetchInspectTrace", response);
        this.locationData = response.data;
        if (this.locationData.length > 0) {
          //   this.$nextTick(() => {
          this.isSelect = true;
          this.mapLoading();
          this.getLiveAddress(this.locationData[0].deviceSerial);
          //   });
        } else {
          this.isSelect = false;
          this.noRecord = true;
        }

        // this.mapLoading();
        // // 坐标转换为高德坐标
        // this.locationData1 = this.locationData.forEach((item) => {
        //   let item2 = [item.longitude, item.latitude];
        //   AMap.convertFrom(item2, "baidu", function (status, result) {
        //     // console.log("convertFrom", result);
        //     if (result.info === "ok") {
        //       var lnglats = result.locations; // Array.<LngLat>
        //       console.log("convertFrom", result.info);
        //     }
        //   });
        //   //   return;
        // });
      });
    },

    /** 搜索按钮操作 */
    handleQuery() {
      //   this.getList();
      this.value2 = this.value1.substr(0, 10) + " 23:59:59";
      this.fetchInspectList();
      console.log("value1", this.value1);
      //   console.log("value2", this.value2);
      //   console.log("value1", this.value1);
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },

    // 选择设备
    selectDevice(inspectRecordId) {
      this.fetchInspectTrace(inspectRecordId);
    },

    // 左侧栏
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },

    // 监控初始化
    ezopenInit(ezopenUrl) {
      this.EZOPENDemo = new EZUIKit.EZUIKitPlayer({
        // id: id,
        id: "item123",
        width: this.childWidth,
        height: this.childHeight,
        template: "pcLive",
        url: ezopenUrl,
        accessToken: this.accessToken,
        audio: 0,
      });
      window.EZOPENDemo = this.EZOPENDemo;
      console.log("epozen初始化", this.EZOPENDemo);
    },

    // 获取萤石云token
    getEzvizToken() {
      getEzvizToken().then((response) => {
        console.log("getEzvizToken", response);
        this.accessToken = response.msg;
      });
    },

    // 获取播放地址
    getLiveAddress(deviceSerial) {
      //   let formData = new FormData();
      //   formData.append("deviceSerial");
      getLiveAddress(deviceSerial, 1, "2", this.value1, this.value2).then(
        (response) => {
          console.log("getLiveAddress", response);
          // console.log(deviceSerial + channelNo + "-window", channelNo, type);
          this.ezopenInit(response.msg);
        }
      );
    },

    // 加载地图
    mapLoading() {
      console.log("drawLine", this.locationData);
      this.position1 = [
        this.locationData[0].longitude,
        this.locationData[0].latitude,
      ];

      //终点标志位置

      this.position2 = [
        this.locationData[this.locationData.length - 1].longitude,
        this.locationData[this.locationData.length - 1].latitude,
      ];

      //地图显示坐标位置

      this.center = [
        this.locationData[0].longitude,
        this.locationData[0].latitude,
        // this.locationData[this.locationData.length - 1].longitude + 0.004628,
        // this.locationData[this.locationData.length - 1].latitude - 0.0018755,
      ];

      //轨迹坐标数据

      var path = [];

      //时间标志位置数据

      var locationDetails = [];

      for (let i of this.locationData) {
        path.push([i.longitude, i.latitude]);

        locationDetails.push({
          path: [i.longitude, i.latitude],

          gtm: i.gtm,
        });
      }

      this.path = path;

      this.locationDetails = this.intervalMethods(locationDetails);
      //   });
    },
    intervalMethods(data) {
      const mapData = data;

      var i = 0;

      const value = [];

      const mapMethods = () => {
        i += 60;

        if (i < mapData.length) {
          value.push(mapData[i]);

          mapMethods();
        } else {
          return;
        }
      };

      mapMethods();

      return value;
    },
    //显示时间信息层

    showMouseover(data) {
      this.coordinatesTo = true;

      //时间信息层坐标位置
      console.log("时间信息层坐标地址");
      this.coordinatesData = data;
    },
  },
};
</script>

<style scoped>
.amap-wrapper {
  width: 100%;

  /* height: 700px; */
}

/* 信息层css */

.parcel {
  width: 220px;

  height: 120px;

  background-color: #fff;

  border: 2px #3e94f9 solid;

  font-size: 14px;

  color: #000;

  position: relative;

  border-radius: 5px;
}

.el-icon-close {
  position: absolute;

  top: 10px;

  right: 10px;

  font-size: 18px;

  cursor: pointer;
}

.text_li_css {
  width: 90%;

  line-height: 20px;

  margin-left: 18px;
}

.mark_css {
  width: 0;

  height: 0;

  border-left: 10px solid transparent;

  border-right: 10px solid transparent;

  border-top: 14px solid #3e94f9;

  margin-left: 100px;
}
.monitor-display {
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 999;
}
</style>
