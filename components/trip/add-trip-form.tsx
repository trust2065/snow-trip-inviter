import React, { useState } from 'react';
import { View } from 'react-native';
import { Input } from '@rneui/themed';
import supabase from '../../app/utils/supabase';
import { useSnackbar } from '../../app/providers/snackbar-provider';
import Button from '../ui/button';
import { router } from 'expo-router';

type TripData = {
  title: string;
  location: string;
  accommodation: string;
  dates: string;
  transport: string;
  gearRental: string;
  notes: string;
};

export default function AddTripForm() {
  const [draftTrip, setDraftTrip] = useState<TripData>({
    title: '',
    location: '',
    accommodation: '',
    dates: '',
    transport: '',
    gearRental: '',
    notes: '',
  });

  const showSnackbar = useSnackbar();

  const handleChange = (key: keyof TripData, value: string) => {
    setDraftTrip({ ...draftTrip, [key]: value });
  };

  const handleSave = async () => {
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData?.user?.id;
    if (!userId) {
      showSnackbar('使用者未登入', { variant: 'error' });
      return;
    }

    const { error } = await supabase
      .from('trips')
      .insert([{
        user_id: userId,
        title: draftTrip.title,
        location: draftTrip.location,
        accommodation: draftTrip.accommodation,
        dates: draftTrip.dates,
        transport: draftTrip.transport,
        gear_renting: draftTrip.gearRental,
        notes: draftTrip.notes,
      }]);

    if (error) {
      showSnackbar('新增行程失敗: ' + error.message, { variant: 'error' });
    } else {
      showSnackbar('行程新增成功', { variant: 'success' });
      setDraftTrip({
        title: '',
        location: '',
        accommodation: '',
        dates: '',
        transport: '',
        gearRental: '',
        notes: '',
      });

      // return to previous screen
      router.back();
    }
  };

  return (
    <View style={{ padding: 16, gap: 12 }}>
      <Input
        label='標題'
        value={draftTrip.title}
        onChangeText={(text) => handleChange('title', text)}
      />
      <Input
        label='地點'
        value={draftTrip.location}
        onChangeText={(text) => handleChange('location', text)}
      />
      <Input
        label='住宿'
        value={draftTrip.accommodation}
        onChangeText={(text) => handleChange('accommodation', text)}
      />
      <Input
        label='日期'
        value={draftTrip.dates}
        onChangeText={(text) => handleChange('dates', text)}
      />
      <Input
        label='交通'
        value={draftTrip.transport}
        onChangeText={(text) => handleChange('transport', text)}
      />
      <Input
        label='雪具出租'
        value={draftTrip.gearRental}
        onChangeText={(text) => handleChange('gearRental', text)}
      />
      <Input
        label='備註'
        value={draftTrip.notes}
        multiline
        onChangeText={(text) => handleChange('notes', text)}
      />

      <View style={{ flexDirection: 'row', gap: 10, marginTop: 10 }}>
        <Button title='儲存' onPress={handleSave} />
        <Button
          type='outline'
          title='取消'
          onPress={() =>
            setDraftTrip({
              title: '',
              location: '',
              accommodation: '',
              dates: '',
              transport: '',
              gearRental: '',
              notes: '',
            })
          }
        />
      </View>
    </View>
  );
}