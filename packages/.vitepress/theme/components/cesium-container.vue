<script lang="ts" setup>
import { Ion, ScreenSpaceEventType } from 'cesium';
import { createViewer } from 'vesium';
import { shallowRef, watchEffect } from 'vue';
import 'cesium/Build/Cesium/Widgets/widgets.css';

defineOptions({ name: 'CesiumContainer' });

Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIxM2QxOTZmOC00NGEwLTRjOTMtODUzYi03ZmM3MmFhMDhmYjEiLCJpZCI6ODUxMDcsImlhdCI6MTcyNTI3NjU4NH0.ZmrKQrRWFRCQLRSUEuPvVa6kFYvJ_3othkPumVfvQmU';

const elRef = shallowRef<HTMLElement>();
const viewer = createViewer(elRef, {
  animation: false,
  timeline: false,
  infoBox: false,
  fullscreenButton: false,
  geocoder: false,
  homeButton: false,
  navigationHelpButton: false,
  sceneModePicker: false,
  baseLayerPicker: false,
});
watchEffect(() => {
  if (viewer.value) {
    viewer.value.cesiumWidget.screenSpaceEventHandler.removeInputAction(ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
    viewer.value.cesiumWidget.screenSpaceEventHandler.removeInputAction(ScreenSpaceEventType.LEFT_CLICK);
  }
});
</script>

<template>
  <div ref="elRef" position="absolute inset-0" />
  <slot />
</template>
