import type { PlotSkeleton } from '../usePlot';
import { Cartesian3, Color } from 'cesium';
import { canvasCoordToCartesian } from 'vesium';
import { PlotAction } from '../usePlot';

/**
 * 绘制非封闭的间隔框架点，如线段。拖拽时，会在两点之间插入一个控制点，并持续拖拽该点。
 */
export function intervalNonclosed(): PlotSkeleton {
  let dragIndex = -1;
  return {
    disabled: ({ active, defining }) => !active || defining,
    cursor: 'pointer',
    dragCursor: 'crosshair',
    format(packable) {
      const _positions = packable.positions ?? [];
      if (_positions.length < 2) {
        return [];
      }
      const midpoints: Cartesian3[] = [];
      for (let i = 0; i < _positions.length - 1; i++) {
        midpoints.push(Cartesian3.midpoint(_positions[i], _positions[i + 1], new Cartesian3()));
      }
      return midpoints;
    },
    onDrag({ viewer, sampled, packable, event, index, lockCamera, dragging }) {
      lockCamera();
      const position = canvasCoordToCartesian(event.endPosition, viewer.scene);
      if (!position) {
        return;
      }
      const positions = [...packable.positions ?? []];
      if (dragIndex === -1) {
        dragIndex = index;
        positions.splice(index + 1, 0, position);
      }
      else {
        positions[dragIndex + 1] = position;
      }
      if (!dragging) {
        dragIndex = -1;
      }
      sampled.setSample({
        time: packable.time,
        derivative: packable.derivative,
        positions,
      });
    },
    render: ({ position, action }) => {
      const colors = {
        [PlotAction.IDLE]: Color.GREEN.withAlpha(0.4),
        [PlotAction.HOVER]: Color.GREEN.withAlpha(0.6),
        [PlotAction.ACTIVE]: Color.GREEN.withAlpha(1.0),
      };
      return {
        position,
        point: {
          pixelSize: 6,
          color: colors[action],
          disableDepthTestDistance: Number.POSITIVE_INFINITY,
          outlineWidth: 1,
          outlineColor: Color.WHITE.withAlpha(0.4),
        },
      };
    },
  };
}
