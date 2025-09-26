import { StyleSheet, View } from 'react-native';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import ChecklistForm from '@/components/checklist/checklist-form';
import React, { useEffect, useState } from 'react';
import supabase from '@/app/utils/supabase';
import { useSnackbar } from '@/app/providers/snackbar-provider';
import { Button } from '@rneui/themed';

type Trip = { id: string; title: string; dates: string; };
export type Member = { id: string; name: string; };

export default function TabTwoScreen() {
  const showSnackbar = useSnackbar();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [selectedTripId, setSelectedTripId] = useState<string | null>(null);
  const [members, setMembers] = useState<Member[]>([]);

  // 讀取使用者 trips
  const fetchTrips = async () => {
    const { data, error } = await supabase
      .from('trips')
      .select('id, title, dates')
      .order('dates', { ascending: false });

    if (error) {
      showSnackbar('讀取行程失敗: ' + error.message, { variant: 'error' });
    } else if (data.length > 0) {
      setTrips(data);
      const firstTripId = data[0].id;
      setSelectedTripId(firstTripId); // 預設選最近一個

      const { data: members } = await supabase
        .from('trip_members')
        .select('id, name')
        .eq('trip_id', firstTripId);

      setMembers(members ?? []);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={
        <IconSymbol
          size={310}
          color="#808080"
          name="chevron.left.forwardslash.chevron.right"
          style={styles.headerImage}
        />
      }>

      {trips.length > 1 && (
        <View style={styles.buttonContainer}>
          {trips.map((trip) => (
            <Button
              key={trip.id}
              title={trip.title}
              onPress={() => setSelectedTripId(trip.id)}
              buttonStyle={[
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
      )}

      {selectedTripId && <ChecklistForm tripId={selectedTripId} members={members} />}

    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },


  button: {
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

