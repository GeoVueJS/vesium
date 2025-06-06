import type { PlotSkeleton } from '../usePlot';
import { Color } from 'cesium';
import { canvasCoordToCartesian, toCartesian3, toCartographic } from 'vesium';
import { PlotAction } from '../usePlot';

/**
 * 绘制控制的框架点，拖拽时，将更新该控制点的实时位置
 */
export function control(): PlotSkeleton {
  return {
    disabled: ({ active }) => !active,
    cursor: 'pointer',
    dragCursor: 'crosshair',
    onDrag({ viewer, sampled, packable, event, index, lockCamera }) {
      lockCamera();
      const position = canvasCoordToCartesian(event.endPosition, viewer.scene);
      if (position) {
        const positions = [...packable.positions ?? []];
        positions[index] = position;
        sampled.setSample({
          time: packable.time,
          derivative: packable.derivative,
          positions,
        });
      }
    },

    onKeyPressed({ viewer, keyEvent, sampled, packable, index }) {
      const height = toCartographic(viewer!.camera.position)?.height;
      if (!height || !['ArrowUp', 'ArrowRight', 'ArrowDown', 'ArrowLeft'].includes(keyEvent.key))
        return;

      keyEvent.preventDefault();
      let headingAdjust = 0;
      switch (keyEvent.key) {
        case 'ArrowRight':
          headingAdjust = Math.PI / 2;
          break;
        case 'ArrowDown':
          headingAdjust = Math.PI;
          break;
        case 'ArrowLeft':
          headingAdjust = -Math.PI / 2;
          break;
        case 'ArrowUp':
          headingAdjust = 0;
          break;
      }
      const newHeading = (viewer.camera.heading + headingAdjust) % (2 * Math.PI);
      const positions = [...packable.positions ?? []];
      const cartographic = toCartographic(positions[index])!;
      const r = height / 100000;
      const distance = r * Math.PI / 180 / 1000;

      cartographic.latitude += distance * Math.cos(newHeading);
      cartographic.longitude += distance * Math.sin(newHeading);

      positions[index] = toCartesian3(cartographic)!;
      sampled.setSample({
        time: packable.time,
        derivative: packable.derivative,
        positions,
      });
    },
    render: ({ position, action }) => {
      const colors = {
        [PlotAction.IDLE]: Color.BLUE.withAlpha(0.4),
        [PlotAction.HOVER]: Color.BLUE.withAlpha(0.6),
        [PlotAction.ACTIVE]: Color.AQUA.withAlpha(1),
      };
      return {
        position,
        point: {
          pixelSize: 8,
          color: colors[action],
          disableDepthTestDistance: Number.POSITIVE_INFINITY,
          outlineWidth: 1,
          outlineColor: Color.WHITE.withAlpha(0.4),
        },
      };
    },
  };
}
