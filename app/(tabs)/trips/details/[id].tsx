import { View, ScrollView } from 'react-native';
import { Text, } from '@rneui/themed';
import { useState, useEffect } from 'react';
import { useLocalSearchParams, } from 'expo-router';
import supabase from '@/app/utils/supabase';

export default function TripDetailScreen() {
  const params = useLocalSearchParams();
  const tripId = params.id as string;

  const [trip, setTrip] = useState<any>(null);

  // 讀取 trip 資料
  const fetchTrip = async () => {
    const { data, error } = await supabase
      .from('trips')
      .select('*')
      .eq('id', tripId)
      .single();

    if (!error) setTrip(data);
  };

  useEffect(() => {
    fetchTrip();
  }, [tripId]);

  if (!trip) return <Text>讀取中...</Text>;

  return (
    <ScrollView style={{ padding: 16 }}>
      (
      <View>
        <Text h4>{trip.title}</Text>
        <Text>地點: {trip.location}</Text>
        <Text>住宿: {trip.accommodation}</Text>
        <Text>日期: {trip.dates}</Text>
        <Text>交通: {trip.transport}</Text>
        <Text>雪具出租: {trip.gear_renting}</Text>
        <Text>備註: {trip.notes}</Text>
      </View>
      )
    </ScrollView>
  );
}
