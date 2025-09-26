import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';

import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Collapsible } from '@/components/ui/collapsible';
import { Text, Input } from '@rneui/themed';

import Button from '../../components/ui/button';
import { useState } from 'react';
import { useUser } from '../contexts/user-context';

export default function TabThreeScreen() {
  const [tripInfo, setTripInfo] = useState(
    '雪場：[Thredbo]\n住宿點：[Jindabyne]\n日期：[1.01.2025 - 2.01.2025]\n交通：[開車/接駁車]\n雪具出租：[Monster]'
  );

  const [isEditing, setIsEditing] = useState(false);
  const [draftText, setDraftText] = useState(tripInfo);
  const { user } = useUser();
  // todo: build user role system
  const isAdmin = user?.email === 'trust2065@gmail.com';

  const handleSave = () => {
    setTripInfo(draftText);
    setIsEditing(false);
  };

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
      {isAdmin &&
        <View style={styles.buttonsContainer}>
          <Button onPress={() => alert('click')} title="新增行程" />
        </View>
      }
      <ThemedText type='title'>行程列表</ThemedText>
      <Collapsible title="Thredbo 三日遊(9/27-29)" opened>
        {isEditing ? (
          <View>
            <Input
              value={draftText}
              onChangeText={setDraftText}
              multiline
              style={{
                minHeight: 120,
                borderColor: '#ccc',
                borderWidth: 1,
                padding: 8,
                borderRadius: 8,
              }}
            />
            <View style={{ flexDirection: 'row', gap: 10, marginTop: 10 }}>
              <Button title='儲存' onPress={handleSave} />
              <Button type='outline' title='取消' onPress={() => setIsEditing(false)} />
            </View>
          </View>
        ) : (
          <View>
            <ThemedText>
              {tripInfo.split('\n').map((line, idx) => (
                <Text key={idx}>{line}{'\n'}</Text>
              ))}
            </ThemedText>
            {isAdmin ? (
              <View style={styles.mt10}>
                <Button title='編輯' onPress={() => setIsEditing(true)} />
              </View>
            ) : (
              <View style={styles.buttonsContainer}>
                <Button onPress={() => alert('todo 參加')} title="參加" />
              </View>
            )}
          </View>
        )}
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
  },
  mt10: { marginTop: 10 },
});
