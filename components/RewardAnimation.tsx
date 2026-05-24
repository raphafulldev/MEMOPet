import { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';

type RewardAnimationProps = {
  visible: boolean;
};

export function RewardAnimation({ visible }: RewardAnimationProps) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(16)).current;

  useEffect(() => {
    if (!visible) {
      return;
    }

    Animated.parallel([
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 180, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0, duration: 420, useNativeDriver: true }),
      ]),
      Animated.sequence([
        Animated.timing(translateY, { toValue: -18, duration: 280, useNativeDriver: true }),
        Animated.timing(translateY, { toValue: -30, duration: 320, useNativeDriver: true }),
      ]),
    ]).start(() => {
      translateY.setValue(16);
    });
  }, [opacity, translateY, visible]);

  return (
    <View pointerEvents="none" style={styles.container}>
      <Animated.View style={[styles.heartRow, { opacity, transform: [{ translateY }] }]}>
        <Text style={styles.heart}>💛</Text>
        <Text style={styles.heart}>✨</Text>
        <Text style={styles.heart}>🐾</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    minHeight: 28,
  },
  heartRow: {
    flexDirection: 'row',
    gap: 12,
  },
  heart: {
    fontSize: 24,
  },
});
