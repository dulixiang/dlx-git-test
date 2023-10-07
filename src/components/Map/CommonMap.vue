<template>
  <div class="container" ref="container"></div>
</template>

<script>
import AMapLoader from "@amap/amap-jsapi-loader";
export default {
  name: "CommonMap",
  data() {
    return {
      map: null,
    };
  },
  props: {
    toLnglats: {
      type: Array,
      default: null,
    },
    statusValue: {
      type: Number,
      default: null,
    },
  },
  mounted() {
    //DOM初始化完成进行地图初始化
    setTimeout(() => {
      this.initMap();
      //   console.log("toLnglats", this.toLnglats);
    }, 500);
  },
  watch: {
    // statusValue: {
    //   // if (index) {
    //   handler(statusValue) {
    //     if (statusValue == 0 || statusValue == 1 || statusValue == 2) {
    //       this.initMap();
    //       console.log(statusValue);
    //     }
    //   },
    //   // }
    // },
  },
  methods: {
    initMap() {
      AMapLoader.load({
        key: "3582a61a77e85a43b9bbc97e1c39b750", // 申请好的Web端开发者Key，首次调用 load 时必填
        version: "2.0", // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
        plugins: [""], // 需要使用的的插件列表，如比例尺'AMap.Scale'等
      })
        .then((AMap) => {
          this.map = new AMap.Map(this.$refs.container, {
            //设置地图容器id
            viewMode: "3D", //是否为3D地图模式
            zoom: 11, //初始化地图级别
            center: [120.23572, 31.52262], //初始化地图中心点位置
          });

          for (let i = 0; i < this.toLnglats.length; i++) {
            let y;
            if (this.toLnglats[i].location !== null) {
              y = this.toLnglats[i].location.split(",");
            }
            let yNum1 = parseFloat(y[0]);
            let yNum2 = parseFloat(y[1]);
            this.addMarker([yNum1, yNum2], this.toLnglats[i].name);
          }
          // this.addMarker([120.32077, 31.51781]);
        })
        .catch((e) => {
          console.log(e);
        });
    },

    // 实例化点标记
    addMarker(position, name) {
      var markerContent =
        "" +
        '<div class="alarmDevice">' +
        // '   <img src="//a.amap.com/jsapi_demos/static/demo-center/icons/dir-via-marker.png" style="width:30px;height:30px">' +
        // '   <div class="close-btn" onclick="clearMarker()">X</div>' +
        "</div>";
      // 创建标记点的div
      // var markerDiv = document.createElement("div");
      // // 设置标记点className,用于设置点的样式(动画)
      // markerDiv.className = "mapAlarm";
      let marker = new AMap.Marker({
        // icon: new AMap.Icon({
        //   image: url,
        //   size: new AMap.Size(40, 40),
        //   imageSize: new AMap.Size(20, 20),
        // }),
        content: markerContent,
        position,

        offset: new AMap.Pixel(-20, -20),
      });

      // 将标记点div，设置为标记点内容
      // marker.setContent(markerDiv);
      // console.log("marker", markerDiv);
      // 标记点的list，清空点时用
      // this.markerPointList.push(markerPoint);

      // let url =
      //   "https://a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png";

      marker.setMap(this.map);
      // 设置鼠标划过点标记显示的文字提示
      // marker.on("click", () => {
      //   this.makerClick(deviceId);
      // });
      marker.setTitle(name);
    },

    // addMarker(position, deviceName, deviceId) {
    //   let url =
    //     "https://a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png";
    //   let marker = new AMap.Marker({
    //     icon: new AMap.Icon({
    //       image: url,
    //       size: new AMap.Size(40, 40),
    //       imageSize: new AMap.Size(20, 20),
    //     }),
    //     position,

    //     offset: new AMap.Pixel(-20, -20),
    //   });
    //   marker.setMap(this.map);
    //   // 设置鼠标划过点标记显示的文字提示
    //   marker.on("click", () => {
    //     this.makerClick(deviceId);
    //   });
    //   console.log("this.position", position);
    //   marker.setTitle(deviceName);
    // },

    makerClick(deviceId) {
      // console.log("makerClick");
      this.$emit("makerClick", deviceId);
    },
  },
};
</script>
<style scoped>
.container {
  padding: 0px;
  margin: 0px;
  width: 100%;
  /* height: 100%; */
  min-height: calc(100vh - 130px);
  border-radius: 20px;
}
::v-deep.amap-icon img {
  width: 26px !important;
}
</style>
<style>
.alarmDevice {
  text-align: center;
  margin: 0 auto;
  width: 20px;
  height: 20px;
  background-color: #517bff;
  box-shadow: 0px 0px 10px #b7ccfe;
  border-radius: 50%;
  -webkit-animation-name: "alarmDeviceBreath"; /*动画属性名，也就是我们前面keyframes定义的动画名*/
  -webkit-animation-duration: 1s; /*动画持续时间*/
  -webkit-animation-timing-function: ease; /*动画频率，和transition-timing-function是一样的*/
  -webkit-animation-delay: 0s; /*动画延迟时间*/
  -webkit-animation-iteration-count: infinite; /*定义循环资料，infinite为无限次*/
  -webkit-animation-direction: alternate; /*定义动画方式*/
}
@keyframes alarmDeviceBreath {
  0% {
    margin-left: 0;
    margin-top: 0;
    width: 20px;
    height: 20px;
    box-shadow: 0px 0px 10px #b7ccfe;
    opacity: 1.2;
  }

  100% {
    margin-left: 5px;
    margin-top: 5px;
    width: 10px;
    height: 10px;
    box-shadow: 0px 0px 10px #71a8ee;
    opacity: 0.6;
  }
}
.normalDevice span,
.offLineDevice span,
.alarmDevice span {
  line-height: 20px;
  font-size: 13px;
  -webkit-animation-name: "breathSpan";
  -webkit-animation-duration: 1s;
  -webkit-animation-timing-function: ease;
  -webkit-animation-delay: 0s;
  -webkit-animation-iteration-count: infinite;
  -webkit-animation-direction: alternate;
}
@keyframes breathSpan {
  0% {
    line-height: 20px;
  }

  100% {
    line-height: 20px;
  }
}
</style>
