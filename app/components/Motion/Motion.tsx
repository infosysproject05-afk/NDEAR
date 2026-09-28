import React, { useEffect, useRef, useState } from 'react'
import { AccessibilityInfo, Animated, Easing, ViewProps } from 'react-native'

// Start with motion disabled until the device preference has been resolved.
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(true)
  useEffect(() => {
    let active = true
    AccessibilityInfo.isReduceMotionEnabled()
      .then((value) => {
        if (active) setReduced(value)
      })
      .catch(() => {})
    const subscription = AccessibilityInfo.addEventListener(
      'reduceMotionChanged',
      setReduced
    )
    return () => {
      active = false
      subscription.remove()
    }
  }, [])
  return reduced
}

export function usePressMotion() {
  const reduced = useReducedMotion()
  const scale = useRef(new Animated.Value(1)).current
  useEffect(() => {
    if (reduced) {
      scale.stopAnimation()
      scale.setValue(1)
    }
    return () => scale.stopAnimation()
  }, [reduced, scale])
  const animate = (value: number) => {
    if (reduced) return
    Animated.spring(scale, {
      toValue: value,
      speed: 35,
      bounciness: 3,
      useNativeDriver: true
    }).start()
  }
  return {
    motionStyle: { transform: [{ scale }] },
    onPressIn: () => animate(0.98),
    onPressOut: () => animate(1)
  }
}

export default function Motion({
  children,
  style,
  delay = 0,
  ...rest
}: ViewProps & { delay?: number }) {
  const reduced = useReducedMotion()
  const progress = useRef(new Animated.Value(1)).current
  useEffect(() => {
    if (reduced) {
      progress.setValue(1)
      return
    }
    progress.setValue(0)
    const animation = Animated.timing(progress, {
      toValue: 1,
      duration: 380,
      delay,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true
    })
    animation.start()
    return () => animation.stop()
  }, [reduced, delay, progress])
  return (
    <Animated.View
      {...rest}
      style={[
        style,
        {
          opacity: progress.interpolate({
            inputRange: [0, 1],
            outputRange: [0.75, 1]
          }),
          transform: [
            {
              translateY: progress.interpolate({
                inputRange: [0, 1],
                outputRange: [12, 0]
              })
            }
          ]
        }
      ]}
    >
      {children}
    </Animated.View>
  )
}
