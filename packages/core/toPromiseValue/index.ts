import type { MaybeRef } from 'vue';
import { toRaw, toValue } from 'vue';
import { isFunction, isPromise } from '../utils';

export type OnAsyncGetterCancel = (onCancel: () => void) => void;

export type MaybeAsyncGetter<T> = () => (Promise<T> | T);
export type MaybeRefOrAsyncGetter<T> = MaybeRef<T> | MaybeAsyncGetter<T>;

export interface ToPromiseValueOptions {
  /**
   * Determines whether the source should be unwrapped to its raw value.
   * @default true
   */
  raw?: boolean;
}

/**
 * Similar to Vue's built-in `toValue`, but capable of handling asynchronous functions, thus returning a `await value`.
 *
 * Used in conjunction with VueUse's `computedAsync`.
 *
 * @param source The source value, which can be a reactive reference or an asynchronous getter.
 * @param options Conversion options
 *
 * @example
 * ```ts
 *
 * const data = computedAsync(async ()=> {
 *  return await toPromiseValue(promiseRef)
 * })
 *
 * ```
 */
export async function toPromiseValue<T>(source: MaybeRefOrAsyncGetter<T>, options: ToPromiseValueOptions = {}): Promise<T> {
  try {
    const { raw = true } = options;
    let value: T;

    if (isFunction(source)) {
      value = await source();
    }
    else {
      const result = toValue(source);
      value = isPromise(result) ? await result : result;
    }
    return raw ? toRaw(value) : value;
  }
  catch (error) {
    console.error(error);
    throw error;
  }
}
