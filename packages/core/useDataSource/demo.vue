<script setup lang="ts">
import * as Cesium from 'cesium';
import { useDataSource, useViewer } from 'vesium';
import { watchPostEffect } from 'vue';
import geojson from '../../.vitepress/static/geojson.json?url';

const dataSource = useDataSource(() => Cesium.GeoJsonDataSource.load(geojson));

const viewer = useViewer();
watchPostEffect(() => {
  if (dataSource.value) {
    viewer.value?.flyTo(
      dataSource.value,
      {
        duration: 1,
      },
    );
  }
});
</script>

<template>
</template>
vuesium
