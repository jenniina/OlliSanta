import { useState, useEffect } from "react"

type ReturnType<T> = [T, (value: T | ((val: T) => T)) => void, () => void]

const noopStorage: Storage = {
  get length() {
    return 0
  },
  clear() {
    // noop
  },
  getItem(_key: string) {
    return null
  },
  key(_index: number) {
    return null
  },
  removeItem(_key: string) {
    // noop
  },
  setItem(_key: string, _value: string) {
    // noop
  },
}

export default function useLocalStorage<T>(key: string, defaultValue: T) {
  const storageObject =
    typeof window === "undefined" ? noopStorage : window.localStorage
  return useStorage(key, defaultValue, storageObject)
}

export function useSessionStorage<T>(key: string, defaultValue: T) {
  const storageObject =
    typeof window === "undefined" ? noopStorage : window.sessionStorage
  return useStorage(key, defaultValue, storageObject)
}

function useStorage<T>(
  key: string,
  defaultValue: T,
  storageObject: Storage
): ReturnType<T> {
  const [value, setValue] = useState<T>(() => {
    const jsonValue = storageObject?.getItem(key)
    if (jsonValue != null) return JSON.parse(jsonValue)

    if (typeof defaultValue === "function") {
      return defaultValue()
    } else {
      return defaultValue
    }
  })

  useEffect(() => {
    if (value === undefined) return storageObject?.removeItem(key)
    storageObject?.setItem(key, JSON.stringify(value))
  }, [key, value, storageObject])

  const remove = () => {
    return storageObject?.removeItem(key)
  }

  const setValueWithFunction = (value: T | ((val: T) => T)) => {
    if (typeof value === "function") {
      setValue((currentValue) => (value as (val: T) => T)(currentValue))
    } else {
      setValue(value)
    }
  }

  return [value, setValueWithFunction, remove]
}
