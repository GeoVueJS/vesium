import type { ShallowRef } from 'vue';
import type { PlotFeatureConstructorOptions } from './PlotFeature';
import type { SampledPlotPackable } from './SampledPlotProperty';
import { JulianDate, ScreenSpaceEventType } from 'cesium';
import { pickHitGraphic, useCesiumEventListener, useScreenSpaceEventHandler, useViewer } from 'vesium';
import { computed, shallowReactive, shallowRef, watch } from 'vue';
import { PlotFeature } from './PlotFeature';
import { useRender } from './useRender';
import { useSampled } from './useSampled';
import { useSkeleton } from './useSkeleton';

export interface UsePlotOptions {
  time?: ShallowRef<JulianDate | undefined>;
}

export type UsePlotOperate = (plot: PlotFeature | PlotFeatureConstructorOptions) => Promise<PlotFeature>;

export interface UsePlotRetrun {

  time: ShallowRef<JulianDate | undefined>;

  data?: ShallowRef<PlotFeature[]>;

  current?: ShallowRef<PlotFeature | undefined>;
  /**
   * 触发标绘
   */
  operate: UsePlotOperate;

  /**
   * 强制终止当前进行中的标绘
   */
  cancel: VoidFunction;
}

export function usePlot(options?: UsePlotOptions) {
  const time = options?.time || shallowRef<JulianDate>();

  const viewer = useViewer();

  const getCurrentTime = () => {
    return time.value?.clone() || new JulianDate(0, 0);
  };

  const collection = shallowReactive(new Set<PlotFeature>());
  const plots = computed(() => Array.from(collection));
  const current = shallowRef<PlotFeature>();
  const packable = shallowRef<SampledPlotPackable>();

  useCesiumEventListener([
    () => current.value?.sampled.definitionChanged,
  ], () => {
    packable.value = current.value?.sampled.getValue(getCurrentTime());
  });

  useSampled(current, getCurrentTime);
  useRender(plots, current, getCurrentTime);
  useSkeleton(plots, current, getCurrentTime);

  // 单击激活
  useScreenSpaceEventHandler(ScreenSpaceEventType.LEFT_CLICK, (data) => {
    if (current.value?.defining) {
      return;
    }

    const pick = viewer.value?.scene.pick(data.position.clone());
    // 点击到了骨架点则不处理
    if (pick?.id?.plot instanceof PlotFeature) {
      return;
    }

    if (!pick) {
      current.value = undefined;
      return;
    }

    current.value = plots.value.find(plot => pickHitGraphic(pick, [...plot.entities, ...plot.primitives, ...plot.groundPrimitives]));
  });

  let operateResolve: ((plot: PlotFeature) => void) | undefined;
  let operateReject: (() => void) | undefined;

  // 当前激活的标绘发生变动时，上一个标绘取消激活。若上一标绘仍处于定义态时，应立即强制完成，若无法完成则删除。
  watch(current, (plot, previous) => {
    if (previous) {
      if (previous.defining) {
        const packable = previous.sampled.getValue(getCurrentTime());
        const completed = previous.scheme.allowManualComplete?.(packable);
        if (completed) {
          PlotFeature.setDefining(previous, false);
          operateResolve?.(previous);
        }
        else {
          collection.delete(previous);
        }
      }
    }
  });

  const operate: UsePlotOperate = async (plot) => {
    return new Promise((resolve, reject) => {
      operateResolve = resolve;
      operateReject = reject;
      const _plot = plot instanceof PlotFeature ? plot : new PlotFeature(plot);

      if (!collection.has(_plot)) {
        collection.add(_plot);
      }
      current.value = _plot;
      return resolve(_plot);
    });
  };

  const remove = (plot: PlotFeature): boolean => {
    if (plot === current.value) {
      current.value = undefined;
    }
    if (collection.has(plot)) {
      collection.delete(plot);
      return true;
    }
    return false;
  };

  return {
    plots,
    time,
    operate,
    remove,
    cancel: operateReject,
  };
}
