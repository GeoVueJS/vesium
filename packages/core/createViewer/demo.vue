<script setup lang="ts">
import { createViewer } from 'vesium';
import { shallowRef } from 'vue';
import 'cesium/Build/Cesium/Widgets/widgets.css';

const elRef = shallowRef<HTMLElement>();

createViewer(elRef, {
// ... options
});
</script>

<template>
  <div ref="elRef" class="absolute inset-0" />
</template>
