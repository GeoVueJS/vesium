import { CallbackProperty, Color, Entity, PolygonHierarchy } from 'cesium';
import { control, interval, moved } from '../skeleton';
import { PlotScheme } from '../usePlot';

/**
 * 内置的多边形标绘方案
 */
export const schemePolygon = new PlotScheme({
  type: 'polygon',
  allowManualComplete: packable => packable.positions!.length >= 3,
  skeletons: [
    control,
    interval,
    moved,
  ],

  initEntites: () => [
    new Entity({
      polyline: {
        material: Color.YELLOW.withAlpha(0.5),
      },
      polygon: {
        material: Color.YELLOW.withAlpha(0.5),
      },
    }),
  ],
  render(options) {
    const { mouse, packable } = options;
    const entity = options.previous.entities?.[0]
      ?? new Entity({
        polyline: {
          material: Color.YELLOW.withAlpha(0.5),
        },
        polygon: {
          material: Color.YELLOW.withAlpha(0.5),
        },
      });

    const positions = [...packable.positions ?? []];
    mouse && positions.push(mouse);

    if (positions.length === 2) {
      entity.polygon!.hierarchy = undefined;
      entity.polyline!.positions = new CallbackProperty(() => positions, false);
    }
    else if (positions.length >= 3) {
      entity.polyline!.positions = undefined;
      entity.polygon!.hierarchy = new CallbackProperty(() => {
        positions.push(positions[0]);
        return positions.length >= 3 ? new PolygonHierarchy([...positions]) : undefined;
      }, false);
    }
    else {
      entity.polygon!.hierarchy = undefined;
      entity.polyline!.positions = undefined;
    }

    return {
      entities: [entity],
    };
  },
});
