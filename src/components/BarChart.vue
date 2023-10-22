<script setup>
  import { computed, onMounted, onUnmounted, ref, watch, nextTick } from 'vue';
  import { init } from 'echarts';

  function createResizeEvent(myChart) {
    return function () {
      if (myChart) {
        myChart.resize({
          width: 'auto',
          height: 'auto',
          silent: false,
          animation: {
            duration: 100,
          }
        });
      }
    };
  }

  // interface YData {
  //   id: number | string;
  //   name: number | string;
  //   data: Array<string | number>;
  //   color: string;
  // }

  const props = defineProps({
    isLegend: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: '',
    },
    label: {
      type: Boolean,
      default: false,
    },
    border: {
      type: Boolean,
      default: false,
    },
    width: {
      type: Number,
      default: 600,
    },
    height: {
      type: Number,
      default: 400,
    },
    xAxisData: {
      // X軸各柱的名稱
      type: Array,// as PropType<string[]>,
      default: () => [],
    },
    yAxisData: {
      // Y軸 value
      type: Array,// as PropType<Array<YData>>,
      default: () => [],
    },
    chartLineColor: {
      // Y軸顏色
      type: String,
      default: '#000000',
    },
    chartBackgroundColor: {
      // 圖表背景色
      type: String,
      default: '255, 255 ,255',
    },
    transparent: {
      type: String,
      default: '0',
    },
    stack: {
      type: Boolean,
      default: false,
    },
    turn: {
      type: Boolean,
      default: false,
    },
  });
  const options = computed(() => {
    const xData = {
      type: 'category',
      data: props.xAxisData.map((p) => p).reverse(),
    };
    const yData = {
      type: 'value',
    };
    return {
      title: {
        text: props.title,
        left: 'center',
      },
      backgroundColor: `rgba(${props.chartBackgroundColor}, ${Number(props.transparent) / 100} )`,

      xAxis: props.turn ? yData : xData,
      yAxis: props.turn ? xData : yData,
      label: {
        show: props.label,
        fontSize: 12,
      },
      legend: {
        show: props.isLegend,
        data: props.yAxisData.map((data) => {
          return data.name;
        }),
        top: '5%',
      },

      stack: props.stack,
      series: props.yAxisData
        .map((yData) => {
          return {
            name: yData.name,
            data: yData.data,
            type: 'bar',
            color: yData.color ?? '',
          };
        })
        .reverse(),
    };
  });

  const onResize = ref(null);
  let myChart = null;
  const barCharts = ref(null);
  onMounted(() => {
    if (barCharts.value) {
      myChart = init(barCharts.value);
      onResize.value = createResizeEvent(myChart);
      myChart.setOption(options.value);
      window.addEventListener('resize', onResize.value);
    }
  });
  watch(
    () => props.width,
    async () => {
      if (myChart) {
        await nextTick();
        myChart.resize({
          width: props.width,
          height: props.height,
        });
      }
    },
  );
  watch(
    () => props.height,
    async () => {
      if (myChart) {
        await nextTick();
        myChart.resize({
          width: 'auto',
          height: 'auto',
        });
      }
    },
  );
  watch(
    () => options,
    async () => {
      await nextTick();
      if (barCharts.value && myChart) {
        myChart.setOption(options.value);
      }
    },
    {
      deep: true,
    },
  );
  onUnmounted(() => {
    if (onResize.value) {
      window.removeEventListener('resize', onResize.value);
    }
  });
</script>

<template>
  <div data-testid="chart" ref="barCharts" :style="{ width: width + 'px', height: height + 'px' }"></div>
</template>

<style scoped></style>
