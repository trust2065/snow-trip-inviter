import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, ScrollView } from 'react-native';
import TripForm, { TripData } from '@/components/trip/trip-form';
import { useLocalSearchParams } from 'expo-router';
import { useSnackbar } from '../../../providers/snackbar-provider';
import supabase from '../../../utils/supabase';

export default function EditTripScreen() {
  const params = useLocalSearchParams();
  const tripId = params.id as string;
  const showSnackbar = useSnackbar();

  const [draftTrip, setDraftTrip] = useState<TripData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTrip();
  }, []);

  const fetchTrip = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('trips')
      .select('*')
      .eq('id', tripId)
      .single();

    if (error || !data) {
      showSnackbar('讀取行程失敗', { variant: 'error' });
      setLoading(false);
      return;
    }

    setDraftTrip({
      title: data.title,
      location: data.location,
      accommodation: data.accommodation,
      dates: data.dates,
      transport: data.transport,
      gear_renting: data.gear_renting,
      notes: data.notes,
    });

    setLoading(false);
  };

  if (loading || !draftTrip) {
    return <ActivityIndicator size='large' style={{ flex: 1 }} />;
  }

  return (
    <ScrollView style={{ flex: 1 }}>
      <TripForm initialTrip={draftTrip} tripId={tripId} />
    </ScrollView>
  );
}