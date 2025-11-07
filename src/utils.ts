import { customRef } from 'vue';

interface TaskHandler<T extends (...args: any[]) => Promise<void>> {
  fn: T;
  loading: boolean;
  invoke: (...args: Parameters<T>) => Promise<void>;
}
export const useTask = <T extends (...args: any[]) => Promise<void>>(
  fn: T
): TaskHandler<T> => {
  let loading = false;
  const loadingRef = customRef((track, trigger) => {
    return {
      get() {
        track();
        return loading;
      },
      set(value) {
        loading = value;
        trigger();
      },
    };
  });
  return {
    fn,
    get loading() {
      return loadingRef.value;
    },
    invoke: async (...args: Parameters<T>) => {
      // avoid track getter
      if (loading) return;
      let error: any;
      let finished = false;
      const task = fn(...args)
        .catch((e) => {
          error = e;
        })
        .finally(() => {
          finished = true;
        });
      // 避免界面渲染闪烁
      await new Promise((r) => setTimeout(r));
      if (finished) {
        if (error) throw error;
        return;
      }
      loadingRef.value = true;
      await task;
      loadingRef.value = false;
      if (error) throw error;
    },
  };
};

export const obj2url = (url: string | URL, query: any): string => {
  const u = new URL(url, location.origin);
  Object.entries(query).forEach(([k, v]) => {
    if (v === undefined) return;
    u.searchParams.set(k, String(v));
  });
  return u.toString();
};
export const obj2usp = (obj: any): URLSearchParams => {
  const usp = new URLSearchParams();
  Object.entries(obj).forEach(([k, v]) => {
    if (v === undefined) return;
    usp.set(k, String(v));
  });
  return usp;
};
