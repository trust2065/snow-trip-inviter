import { View, ScrollView, StyleSheet } from 'react-native';
import { Text, } from '@rneui/themed';
import React, { useState, useEffect } from 'react';
import { useLocalSearchParams, useRouter, } from 'expo-router';
import supabase from '@/app/utils/supabase';
import { useUser } from '../../../contexts/user-context';
import Button from '../../../../components/ui/button';
import TripForm from '../../../../components/trip/trip-form';

export default function TripDetailScreen() {
  const { id: tripId } = useLocalSearchParams<{ id: string; }>();
  const { user } = useUser();
  const isAdmin = user?.role === 'admin';

  const [trip, setTrip] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);

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

  return (
    <View>
      {(!trip)
        ? (
          <Text>讀取中...</Text>
        )
        : (
          <ScrollView>
            {isEditing ? (
              <TripForm
                initialTrip={{
                  title: trip.title,
                  location: trip.location,
                  accommodation: trip.accommodation,
                  dates: trip.dates,
                  transport: trip.transport,
                  gear_renting: trip.gear_renting,
                  notes: trip.notes,
                }}
                tripId={trip.id}
                setIsEditing={setIsEditing}
              />
            ) : (
              <View style={styles.container}>
                <Text h4>{trip.title}</Text>
                <Text>地點: {trip.location}</Text>
                <Text>住宿: {trip.accommodation}</Text>
                <Text>日期: {trip.dates}</Text>
                <Text>交通: {trip.transport}</Text>
                <Text>雪具出租: {trip.gear_renting}</Text>
                <Text>備註: {trip.notes}</Text>

                {isAdmin && (
                  <View style={styles.buttonContainer}>
                    <Button title="編輯" onPress={() => setIsEditing(true)} />
                  </View>
                )}
              </View>
            )}
          </ScrollView>
        )}
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    marginTop: 24,
  },
  container: {
    padding: 32,
    gap: 16,
  },
});