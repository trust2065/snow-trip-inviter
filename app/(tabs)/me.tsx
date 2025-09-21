import { Image } from 'expo-image';
import { ActivityIndicator, Alert, StyleSheet, View } from 'react-native';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { useEffect, useState } from 'react';
import Button from '../../components/ui/button';
import supabase from '../utils/supabase';
import { Input, Text } from '@rneui/themed';

export default function HomeScreen() {
  const [snowboard, setSnowboard] = useState<{ length: number; comment?: string; id: string; } | null>(null);
  const [loading, setLoading] = useState(false);
  const [inputLength, setInputLength] = useState(''); // 新增 input state

  useEffect(() => {
    const fetchSnowboard = async () => {
      setLoading(true);

      const { data: userData } = await supabase.auth.getUser();
      const userId = userData?.user?.id;
      if (!userId) {
        console.log('User not logged in');
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('snowboards')
        .select('id, length, comment')
        .eq('user_id', userId)
        .limit(1)
        .maybeSingle();

      if (error) {
        Alert.alert('錯誤', error.message);
      } else if (data) {
        setSnowboard(data);
      }

      setLoading(false);
    };

    fetchSnowboard();
  }, []);

  const deleteSnowboard = async () => {
    if (!snowboard) return;

    setLoading(true);
    try {
      const { error } = await supabase.from('snowboards').delete().eq('id', snowboard.id);
      if (error) {
        Alert.alert('錯誤', error.message);
      } else {
        setSnowboard(null);
      }
    } finally {
      setLoading(false);
    }
  };

  const addSnowboard = async () => {
    setLoading(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData?.user?.id;
      if (!userId) {
        Alert.alert('錯誤', '請先登入');
        return;
      }

      const lengthNum = parseInt(inputLength, 10);
      if (isNaN(lengthNum) || lengthNum <= 0) {
        Alert.alert('錯誤', '請輸入有效長度');
        return;
      }

      const { data, error } = await supabase.from('snowboards').insert([
        {
          user_id: userId,
          brand: 'Burton',
          model: 'Custom',
          length: lengthNum,
        },
      ]).select().single(); // 直接回傳新插入的資料

      if (error) {
        Alert.alert('錯誤', error.message);
      } else {
        setSnowboard(data); // 更新 state → UI 自動切換成顯示模式
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <View style={styles.container}>
      <ActivityIndicator size='large' color='#A1CEDC' />
    </View>
  );

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>
      <View style={{ padding: 20 }}>
        {snowboard ? (
          <>
            <View style={styles.flex}>
              <Text>雪板長度: {snowboard.length}</Text>
              {snowboard.comment ? <Text>備註: {snowboard.comment}</Text> : null}
              <Button title='編輯' onPress={() => console.log('Edit tapped')} />
            </View>
            {/* <View style={{ marginTop: 20 }}>
              <Button title='刪除 ' onPress={deleteSnowboard} />
            </View> */}
          </>
        ) : (
          <View>
            <Input
              placeholder='雪板長度 (cm)'
              value={inputLength}
              onChangeText={setInputLength}
              keyboardType='numeric'
            />
            <Button title='新增雪板' onPress={addSnowboard} />
          </View>
        )}
      </View>
    </ParallaxScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,                  // 撐滿整個螢幕
    justifyContent: 'center', // 垂直置中
    alignItems: 'center',     // 水平置中
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  flex: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
});