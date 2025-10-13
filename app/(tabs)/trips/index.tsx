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
import Auth from '../../../components/auth';
import { useSnackbar } from '../../providers/snackbar-provider';
import { ReadyBubble } from '../../../components/checklist/ready-bubble';
import { Tables } from '../../../database.types';
import { ChecklistRow } from '../../../json_types';

type Trip = Tables<'trips'>;

export type TripAndParticipants = Trip & {
  participants: {
    id: string;
    name: string;
    ready: boolean;
  }[];
};

export default function TabThreeScreen() {
  const [trips, setTrips] = useState<TripAndParticipants[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();
  const router = useRouter();
  const showSnackbar = useSnackbar();

  if (!user) {
    return <Auth />;
  }

  const isAdmin = user.role === 'admin';

  useFocusEffect(
    useCallback(() => {
      fetchTrips();
    }, [])
  );

  const fetchTrips = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('trips')
      .select(`
        *,
        trip_participants (
          profiles (
            id,
            full_name,
            checklist (
              *
            )
          )
        )
      `)
      .order('dates', { ascending: true });

    if (error) {
      console.error('讀取行程失敗', error);
      return;
    }

    setTrips(data?.map((trip) => {
      return {
        ...trip,
        participants: trip.trip_participants?.map(tp => {
          // 這裏的checklist是這個user所有的checklist, 所以要filter掉不是這個trip的
          const checklistForThisTrip = tp.profiles.checklist
            .filter((c): c is ChecklistRow => c.trip_id === trip.id);

          // calculate 'ready'
          const ready = checklistForThisTrip.length > 0 && checklistForThisTrip.every((c: any) => c?.data?.every(
            (section: any) => section.options.every((opt: any) => opt.checked)
          ));

          const { id, full_name: name } = tp.profiles;

          return {
            id,
            name,
            ready
          };
        }) ?? []
      };
    }));
    setLoading(false);
  };

  const joinTrip = async (tripId?: string) => {
    if (!tripId) {
      console.error('Should not happen, no trip id', trips);
      return;
    }

    const { error } = await supabase
      .from('trip_participants')
      .insert({ trip_id: tripId, user_id: user.id })
      .select();

    if (error) {
      console.error('加入行程失敗', error);
      return;
    }

    await fetchTrips();
    showSnackbar('加入行程成功', { variant: 'success' });
  };

  const dropTrip = async (tripId?: string) => {
    if (!tripId) {
      console.error('Should not happen, no trip id', trips);
      return;
    }

    const { error } = await supabase
      .from('trip_participants')
      .delete()
      .eq('trip_id', tripId)
      .eq('user_id', user.id)
      .select();

    if (error) {
      console.error('取消行程失敗', error);
      return;
    }

    await fetchTrips();
    showSnackbar('取消行程成功', { variant: 'success' });
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={
        <Image
          source={require('@/assets/images/h1.png')}
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
              {`雪場：[${trip.location}]\n住宿：[${trip.accommodation}]\n日期：[${trip.dates}]\n`}
            </ThemedText>
            <>
              {trip.participants && trip.participants.length > 0 && (
                <View style={[styles.flexRow, styles.mt10]}>
                  {trip.participants.map(p => (
                    <ReadyBubble
                      key={p.id}
                      name={p.name}
                      showTick={p.ready}
                    />
                  ))}
                </View>
              )}
            </>

            {isAdmin ? (
              <View style={styles.mt10}>
                <View style={styles.buttonsContainer}>
                  <Button title='詳情' onPress={() => router.push(`/(tabs)/trips/details/${trip.id}`)} />
                </View>
              </View>
            ) : (
              <View style={styles.buttonsContainer}>
                <Button title='詳情' onPress={() => router.push(`/(tabs)/trips/details/${trip.id}`)} />
                {trip.participants?.map(p => p.id).includes(user.id) ? (
                  <Button
                    type='outline'
                    title='取消參加'
                    onPress={() => dropTrip(trip.id)}
                  />
                ) : (
                  <Button
                    title='參加'
                    onPress={() => joinTrip(trip.id)}
                  />
                )}
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
    height: 180,
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  flexRow: {
    display: 'flex',
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