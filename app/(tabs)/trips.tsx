import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';

import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Collapsible } from '@/components/ui/collapsible';
import { CheckBox, Button } from '@rneui/themed';
import { useState } from 'react';

export default function TabThreeScreen() {
  const [checked, setChecked] = useState(true);
  const toggleCheckbox = () => setChecked(!checked);

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={
        <Image
          source={require('@/assets/images/icon.png')}
          style={styles.headerImage}
        />
      }>
      <ThemedView style={styles.titleContainer}>
      </ThemedView>
      <View style={styles.buttonsContainer}>
        <Button style={styles.button} onPress={() => alert('click')} title="新增行程" />
      </View>
      <ThemedText type='title'>行程列表</ThemedText>
      <Collapsible title="Thredbo 三日遊(9/27-29)">
        <CheckBox
          checked={checked}
          onPress={toggleCheckbox}
          iconType="material-community"
          checkedIcon="checkbox-outline"
          uncheckedIcon={'checkbox-blank-outline'}
        />
        <ThemedText>
          週六中午出發, 預計滑雪兩天, 週一中午回程
        </ThemedText>
        <View style={styles.buttonsContainer}>
          <Button style={styles.button} onPress={() => alert('todo 參加')} title="參加" />
        </View>
      </Collapsible>
      <Collapsible title="Thredbo 三日遊(9/27-29)">
        <CheckBox
          checked={checked}
          onPress={toggleCheckbox}
          iconType="material-community"
          checkedIcon="checkbox-outline"
          uncheckedIcon={'checkbox-blank-outline'}
        />
        <ThemedText>
          週六中午出發, 預計滑雪兩天, 週一中午回程
        </ThemedText>
        <View style={styles.buttonsContainer}>
          <Button style={styles.button} onPress={() => alert('todo 參加')} title="參加" />
        </View>
      </Collapsible>
      <Collapsible title="Thredbo 三日遊(9/27-29)">
        <CheckBox
          checked={checked}
          onPress={toggleCheckbox}
          iconType="material-community"
          checkedIcon="checkbox-outline"
          uncheckedIcon={'checkbox-blank-outline'}
        />
        <ThemedText>
          週六中午出發, 預計滑雪兩天, 週一中午回程
        </ThemedText>
        <View style={styles.buttonsContainer}>
          <Button style={styles.button} onPress={() => alert('todo 參加')} title="參加" />
        </View>
      </Collapsible>
      <Collapsible title="Thredbo 三日遊(9/27-29)">
        <CheckBox
          checked={checked}
          onPress={toggleCheckbox}
          iconType="material-community"
          checkedIcon="checkbox-outline"
          uncheckedIcon={'checkbox-blank-outline'}
        />
        <ThemedText>
          週六中午出發, 預計滑雪兩天, 週一中午回程
        </ThemedText>
        <View style={styles.buttonsContainer}>
          <Button style={styles.button} onPress={() => alert('todo 參加')} title="參加" />
        </View>
      </Collapsible>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    width: '100%',
    height: 250,
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  buttonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: '100%',
    marginVertical: 20,
  },
  button: {
    width: 120,
  }
});
