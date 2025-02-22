import type { Entity, EntityCollection } from 'cesium';
import type { MaybeRefOrGetter, ShallowReactive } from 'vue';
import type { EffcetRemovePredicate } from '../useCollectionScope';
import { computed, toValue } from 'vue';
import { useCollectionScope } from '../useCollectionScope';
import { useViewer } from '../useViewer';

export interface UseEntityScopeOptions {
  /**
   * The collection of Entity to be added
   * @default useViewer().value.entities
   */
  collection?: MaybeRefOrGetter<EntityCollection>;
}

export interface UseEntityScopeRetrun {
  /**
   * A `Set` for storing SideEffect instance,
   * which is encapsulated using `ShallowReactive` to provide Vue's reactive functionality
   */
  scope: Readonly<ShallowReactive<Set<Entity>>>;

  /**
   * Add SideEffect instance
   */
  add: <T extends Entity>(entity: T) => T;

  /**
   * Remove specified SideEffect instance
   */
  remove: (entity: Entity, destroy?: boolean) => boolean;

  /**
   * Remove all SideEffect instance that meets the specified criteria
   */
  removeWhere: (predicate: EffcetRemovePredicate<Entity>, destroy?: boolean) => void;

  /**
   * Remove all SideEffect instance within current scope
   */
  removeScope: (destroy?: boolean) => void;
}

/**
 * Make `add` and `remove` operations of `EntityCollection` scoped,
 * automatically remove `Entity` instance when component is unmounted.
 */
export function useEntityScope(options: UseEntityScopeOptions = {}): UseEntityScopeRetrun {
  const { collection: _collection } = options;
  const viewer = useViewer();

  const collection = computed(() => {
    return toValue(_collection) ?? viewer.value?.entities;
  });

  const addFn = <T extends Entity>(entity: T): T => {
    if (!collection.value) {
      throw new Error('collection is not defined');
    }
    if (!collection.value.contains(entity)) {
      collection.value.add(entity);
    }
    return entity;
  };

  const removeFn = (entity: Entity) => {
    return !!collection.value?.remove(entity);
  };

  const { scope, add, remove, removeWhere, removeScope } = useCollectionScope<false>(addFn, removeFn, []);
  return {
    scope,
    add,
    remove,
    removeWhere,
    removeScope,
  };
}
