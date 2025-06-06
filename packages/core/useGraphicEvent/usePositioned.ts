import type { ScreenSpaceEventHandler } from 'cesium';
import { ScreenSpaceEventType } from 'cesium';
import { useScreenSpaceEventHandler } from '../useScreenSpaceEventHandler';
import { useViewer } from '../useViewer';

export type PositionedEventType = 'LEFT_DOWN' | 'LEFT_UP' | 'LEFT_CLICK' | 'LEFT_DOUBLE_CLICK' | 'RIGHT_DOWN' | 'RIGHT_UP' | 'RIGHT_CLICK' | 'MIDDLE_DOWN' | 'MIDDLE_UP' | 'MIDDLE_CLICK';

 type PositiondScreenSpaceEventType =
   ScreenSpaceEventType.LEFT_DOWN |
   ScreenSpaceEventType.LEFT_UP |
   ScreenSpaceEventType.LEFT_CLICK |
   ScreenSpaceEventType.LEFT_DOUBLE_CLICK |
   ScreenSpaceEventType.RIGHT_DOWN |
   ScreenSpaceEventType.RIGHT_UP |
   ScreenSpaceEventType.RIGHT_CLICK |
   ScreenSpaceEventType.MIDDLE_DOWN |
   ScreenSpaceEventType.MIDDLE_UP |
   ScreenSpaceEventType.MIDDLE_CLICK;

/**
 * @internal
 */
const EVENT_TYPE_RECORD: Record<PositionedEventType, PositiondScreenSpaceEventType> = {
  LEFT_DOWN: ScreenSpaceEventType.LEFT_DOWN,
  LEFT_UP: ScreenSpaceEventType.LEFT_UP,
  LEFT_CLICK: ScreenSpaceEventType.LEFT_CLICK,
  LEFT_DOUBLE_CLICK: ScreenSpaceEventType.LEFT_DOUBLE_CLICK,
  RIGHT_DOWN: ScreenSpaceEventType.RIGHT_DOWN,
  RIGHT_UP: ScreenSpaceEventType.RIGHT_UP,
  RIGHT_CLICK: ScreenSpaceEventType.RIGHT_CLICK,
  MIDDLE_DOWN: ScreenSpaceEventType.MIDDLE_DOWN,
  MIDDLE_UP: ScreenSpaceEventType.MIDDLE_UP,
  MIDDLE_CLICK: ScreenSpaceEventType.MIDDLE_CLICK,
};

/**
 * Parameters for graphics click related events
 */
export interface GraphicPositionedEvent {
  /**
   * Event of the picked area
   */
  event: ScreenSpaceEventHandler.PositionedEvent;
  /**
   * The graphic object picked by `scene.pick`
   */
  pick: any;
}

export function usePositioned(
  type: PositionedEventType,
  listener: (params: GraphicPositionedEvent) => void,
) {
  const screenEvent = EVENT_TYPE_RECORD[type];
  const viewer = useViewer();
  useScreenSpaceEventHandler(screenEvent, (event) => {
    const position = event.position;
    const pick = viewer.value?.scene.pick(position);
    pick && position && listener({ event: { position }, pick });
  });
}
