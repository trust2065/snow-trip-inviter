import { StyleSheet, View } from 'react-native';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import ChecklistForm from '@/components/checklist/checklist-form';
import React, { useCallback, useState } from 'react';
import supabase from '@/app/utils/supabase';
import { useSnackbar } from '@/app/providers/snackbar-provider';
import { Button, Text } from '@rneui/themed';
import { Image } from 'expo-image';
import { useUser } from '../contexts/user-context';
import Auth from '../../components/auth';
import { useFocusEffect } from 'expo-router';
import { Tables } from '../../database.types';
import Loading from '../../components/loading';

type Trip = Pick<Tables<'trips'>, 'id' | 'title' | 'dates'>;

export default function TabTwoScreen() {
  const showSnackbar = useSnackbar();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [selectedTripId, setSelectedTripId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const { user } = useUser();

  if (!user) {
    return (
      <Auth />
    );
  }

  // 讀取該user的所有trips
  const fetchTrips = async () => {
    setLoading(true);
    // 1️⃣ 取得參與users的 trip_ids
    const { data: participants, error: partError } = await supabase
      .from('trip_participants')
      .select('trip_id')
      .eq('user_id', user.id);

    if (partError) {
      console.error(partError);
      return;
    }

    const tripIds = participants?.map(p => p.trip_id) || [];

    if (tripIds.length === 0) {
      console.log('User is not participating in any trips');
      return;
    }

    // 2️⃣ 用 trip_ids 抓 trips 詳細資料
    const { data, error: tripsError } = await supabase
      .from('trips')
      .select('id, title, dates')
      .in('id', tripIds)
      .order('dates', { ascending: false });

    if (tripsError) {
      setLoading(false);
      showSnackbar('讀取行程失敗: ' + tripsError.message, { variant: 'error' });
    } else if (data.length > 0) {
      setTrips(data);
      const firstTripId = data[0].id;
      setSelectedTripId(firstTripId); // 預設選最近一個

      // const { data: members } = await supabase
      //   .from('trip_members')
      //   .select('id, name')
      //   .eq('trip_id', firstTripId);

      // setMembers(members ?? []);
    }

    setLoading(false);
  };

  useFocusEffect(
    useCallback(() => {
      fetchTrips();
    }, [user?.id])
  );

  if (loading) {
    return (
      <Loading />
    );
  }

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={
        <Image
          source={require('@/assets/images/h2.png')}
          style={styles.headerImage}
        />
      }>

      {(
        <>
          {trips.length > 1 && (
            <View style={styles.buttonHeader}>
              <Text>選擇行程</Text>
            </View>
          )}
          <View style={styles.buttonContainer}>
            {trips.map((trip) => (
              <Button
                key={trip.id}
                type='clear'
                title={trip.title}
                onPress={() => setSelectedTripId(trip.id)}
                containerStyle={[
                  styles.button,
                  trip.id === selectedTripId && styles.selectedButton,
                ]}
                titleStyle={[
                  styles.buttonText,
                  trip.id === selectedTripId && styles.selectedText,
                ]}
              />
            ))}
          </View>
        </>
      )}

      {selectedTripId && <ChecklistForm tripId={selectedTripId} />}

    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    width: '100%',
    height: 180,
  },
  buttonHeader: {
    flex: 1
  },
  button: {
    borderRadius: 8,
    backgroundColor: '#E0E0E0', // 未選
  },
  selectedButton: {
    backgroundColor: '#007BFF', // 選中
  },
  buttonText: {
    color: '#333333', // 未選文字
  },
  selectedText: {
    color: '#FFFFFF', // 選中文字
  },
  buttonContainer: {
    flexDirection: 'row',   // 橫向排列
    flexWrap: 'wrap',       // 超出寬度自動換行
    gap: 10,                // 每個 button 間隔
    marginVertical: 10,
  },
});

