import { useState, useEffect, useCallback } from 'react';

/**
 * useLocalStorage Hook
 * 用于在 localStorage 中持久化存储数据
 * @param key - localStorage 的键名
 * @param initialValue - 初始值
 * @returns [storedValue, setValue] - 当前值和设置值的函数
 */
export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
  // 获取初始值（从 localStorage 或默认值）
  const readValue = useCallback((): T => {
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  }, [initialValue, key]);

  const [storedValue, setStoredValue] = useState<T>(readValue);

  // 设置值到 localStorage 和 state
  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      // 允许值是一个函数，类似于 useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      // 保存到 state
      setStoredValue(valueToStore);
      
      // 保存到 localStorage
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  // 监听其他窗口的 storage 变化
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === key && event.newValue) {
        setStoredValue(JSON.parse(event.newValue));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key]);

  return [storedValue, setValue];
}

export default useLocalStorage;
