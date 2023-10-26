import React, {useMemo} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {EdgeInsets, useSafeAreaInsets} from 'react-native-safe-area-context';

const insetCalc = (insets: EdgeInsets) => ({
  paddingTop: Math.max(insets.top, 16),
  paddingBottom: Math.max(insets.bottom, 16),
  paddingLeft: Math.max(insets.left, 16),
  paddingRight: Math.max(insets.right, 16),
});

export const Home = () => {
  const insets = useSafeAreaInsets();

  const style = useMemo(() => insetCalc(insets), [insets]);

  return (
    <View style={style}>
      <Text style={styles.paragraph}>
        Thanks for trying our development challenge!
      </Text>
      <Text style={styles.paragraph}>
        Please see README.md for full instructions.
      </Text>
      <Text style={styles.paragraph}>
        When complete, please push to a github public repo that you can share
        with us.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  paragraph: {
    marginBottom: 16,
  },
});
