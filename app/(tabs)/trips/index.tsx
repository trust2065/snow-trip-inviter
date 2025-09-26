import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Collapsible } from '@/components/ui/collapsible';
import Button from '@/components/ui/button';
import { useState, useCallback } from 'react';
import { useFocusEffect, useRouter } from 'expo-router';
import { useUser } from '../../contexts/user-context';
import supabase from '../../utils/supabase';
import { TripData } from '../../../components/trip/trip-form';

export default function TabThreeScreen() {
  const [trips, setTrips] = useState<TripData[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();
  const router = useRouter();

  const isAdmin = user?.role === 'admin';

  useFocusEffect(
    useCallback(() => {
      fetchTrips();
    }, [])
  );

  const fetchTrips = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('trips')
      .select('*')
      .order('dates', { ascending: true });

    if (error) {
      console.error('讀取行程失敗', error);
    } else {
      setTrips(data);
    }
    setLoading(false);
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
      <ThemedView style={styles.titleContainer} />
      {isAdmin && (
        <View style={styles.buttonsContainer}>
          <Button
            type='outline'
            title='新行程'
            onPress={() => router.push('/(tabs)/trips/add-trip')}
          />
        </View>
      )}
      <ThemedText type='title'>行程列表</ThemedText>
      {loading ? (
        <ThemedText>讀取中...</ThemedText>
      ) : (
        trips.map((trip) => (
          <Collapsible key={trip.id} title={trip.title} opened>
            <ThemedText>
              {`雪場：[${trip.location}]\n住宿：[${trip.accommodation}]\n日期：[${trip.dates}]\n交通：[${trip.transport}]\n雪具出租：[${trip.gear_renting}]\n備註：[${trip.notes}]`}
            </ThemedText>
            {isAdmin ? (
              <View style={styles.mt10}>
                <View style={styles.buttonsContainer}>
                  <Button title='詳情' onPress={() => router.push(`/(tabs)/trips/details/${trip.id}`)} />
                </View>
              </View>
            ) : (
              <View style={styles.buttonsContainer}>
                <Button title='詳情' onPress={() => router.push(`/(tabs)/trips/details/${trip.id}`)} />
                <Button title='參加' onPress={() => alert('todo 參加')} />
              </View>
            )}
          </Collapsible>
        ))
      )}
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
    gap: 16,
  },
  mt10: { marginTop: 10 },
});