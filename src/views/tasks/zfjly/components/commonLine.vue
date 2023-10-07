<template>
  <div>
    <div class="amap-wrapper">
      <!-- 高德地图 -->
      <amap ref="myMap" :center="center" :zoom="zoom" @complete="mapLoading">
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
        <amap-polyline :stroke-weight="8" :path="path" stroke-color="#00A5BD" />
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
                <i class="el-icon-close" @click="coordinatesData = null"></i>
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
  </div>
</template>

<script>
import iconimg from "@/assets/logo/logo.png";
import Amap from "@amap/amap-vue/lib/amap";
import AmapMarker from "@amap/amap-vue/lib/marker";
import AmapText from "@amap/amap-vue/lib/text";
import AmapPolyline from "@amap/amap-vue/lib/polyline";
import AmapControlBar from "@amap/amap-vue/lib/control-bar";
import AmapToolBar from "@amap/amap-vue/lib/tool-bar";
import AmapInfoWindow from "@amap/amap-vue/lib/info-window";
export default {
  components: {
    Amap,
    AmapMarker,
    AmapText,
    AmapPolyline,
    AmapControlBar,
    AmapToolBar,
    AmapInfoWindow,
  },
  data() {
    return {
      //引入的时间标志图标
      iconimg,
      //时间标志位置数据
      locationDetails: [],
      //时间信息层坐标位置
      coordinatesData: { path: [116.397447, 39.909183], gtm: "" },
      //   coordinatesData: { path: [116.397447, 39.909183], gtm: "" },
      //时间信息层初始隐藏
      coordinatesTo: false,
      //地图显示坐标位置
      center: [120.23572, 31.52262],
      //地图初始缩放等级
      zoom: 20,
      //起点标志位置
      position1: [0, 0],
      text1: "起点位置",
      //终点标志位置
      position2: [0, 0],
      text2: "终点位置",
      //轨迹坐标数据
      path: [],
      //异步网络请求的坐标数据
      //   locationData: {},
    };
  },
  props: {
    locationData: {
      type: Array,
      default: null,
    },
  },
  methods: {
    // getInspectTrace
    mapLoading() {
      console.log("drawLine", this.locationData);
      //   getInspectTrace(inspectRecordId).then((response) => {
      //     this.locationData = response.data;
      //     console.log("fetchInspectTrace", response);

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
        this.locationData[this.locationData.length - 1].longitude,
        this.locationData[this.locationData.length - 1].latitude,
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

<style></style>
