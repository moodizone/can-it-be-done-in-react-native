import React from "react";
import { Dimensions } from "react-native";
import Animated from "react-native-reanimated";

import { PanGestureHandler, State } from "react-native-gesture-handler";
import { onGestureEvent, withSpring } from "react-native-redash";
import Weave from "./Weave";
import {
  initialWaveCenter,
  sideWidth,
  waveHorRadius,
  waveHorRadiuswaveHorRadiusBack,
  waveVertRadius
} from "./WeaveHelpers";

const { width } = Dimensions.get("window");
const { Value, interpolate, greaterOrEq, cond, useCode, debug } = Animated;

export default () => {
  const translationX = new Value(0);
  const translationY = new Value(0);
  const velocityX = new Value(0);
  const velocityY = new Value(0);
  const state = new Value(State.UNDETERMINED);
  const gestureHandler = onGestureEvent({
    translationX,
    translationY,
    velocityX,
    velocityY,
    state
  });
  const translateX = withSpring({
    value: translationX,
    velocity: velocityX,
    state,
    snapPoints: [-width, 0]
  });
  const translateY = withSpring({
    value: translationY,
    velocity: velocityY,
    state,
    snapPoints: [initialWaveCenter],
    offset: new Value(initialWaveCenter)
  });
  const progress = interpolate(translateX, {
    inputRange: [-width, 0],
    outputRange: [1, 0]
  });
  const horRadius = waveHorRadius(progress);
  const vertRadius = waveVertRadius(progress);
  const sWidth = sideWidth(progress);
  useCode(debug("velocityX", velocityX), []);
  return (
    <PanGestureHandler {...gestureHandler}>
      <Animated.View>
        <Weave
          centerY={translateY}
          sideWidth={sWidth}
          {...{ horRadius, vertRadius }}
        />
      </Animated.View>
    </PanGestureHandler>
  );
};