<script setup lang="ts">
import { useEntity, useViewer } from '@vesium/core';
import { toCartesian3 } from '@vesium/shared';
import { WaterRippleMaterialProperty } from '@vesium/special';
import * as Cesium from 'cesium';
import { watchEffect } from 'vue';

const rectangle = Cesium.Rectangle.fromDegrees(145, 30, 145.01, 30.01);

useEntity(new Cesium.Entity({
  rectangle: {
    coordinates: rectangle,
    material: new WaterRippleMaterialProperty({}),
  },
}));

const viewer = useViewer();
watchEffect(() => {
  const center = Cesium.Rectangle.center(rectangle);
  center.height = 20;
  viewer.value?.camera.flyTo({
    destination: toCartesian3(center)!,
    duration: 1,
  });
});
</script>

<template>
  <div />
</template>
