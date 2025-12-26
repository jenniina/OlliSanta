import { useCallback, useEffect, useMemo, RefObject } from 'react'

interface Props {
  ref: RefObject<HTMLElement | null>
  onOutsideClick: (e: Event) => void
  allowAnyKey?: boolean
  triggerKeys?: string[]
}

type EventConfigItem = [
  string,
  (
    | ((e: Event) => void)
    | ((e: Event | MouseEvent | TouchEvent) => void)
    | ((e: Event | KeyboardEvent) => void)
  )
]

export function useOutsideClick({
  ref,
  onOutsideClick,
  allowAnyKey,
  triggerKeys,
}: Props) {
  const keyListener = useCallback(
    (e: KeyboardEvent) => {
      if (allowAnyKey) {
        onOutsideClick(e)
      } else if (triggerKeys) {
        if (triggerKeys.includes(e.key)) {
          onOutsideClick(e)
        }
      } else {
        if (e.key === 'Escape') {
          onOutsideClick(e)
        }
      }
    },
    [allowAnyKey, triggerKeys, onOutsideClick]
  )

  const clickOrTouchListener = useCallback(
    (e: MouseEvent | TouchEvent) => {
      if (ref && ref.current) {
        if (!(ref.current! as HTMLElement).contains(e.target as HTMLElement)) {
          onOutsideClick?.(e)
        }
      }
    },
    [ref, onOutsideClick]
  )

  const eventsConfig = useMemo(
    () => [
      ['click', clickOrTouchListener] as EventConfigItem,
      ['touchstart', clickOrTouchListener] as EventConfigItem,
      ['keyup', keyListener] as EventConfigItem,
    ],
    [clickOrTouchListener, keyListener]
  )

  useEffect(() => {
    eventsConfig.forEach(([eventName, listener]) => {
      document.addEventListener(eventName, listener)
    })

    return () => {
      eventsConfig.forEach(([eventName, listener]) => {
        document.removeEventListener(eventName, listener)
      })
    }
  }, [eventsConfig])

  return ref
}
