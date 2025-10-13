import React, { useState } from 'react';
import { View } from 'react-native';
import { Input } from '@rneui/themed';
import supabase from '../../app/utils/supabase';
import { useSnackbar } from '../../app/providers/snackbar-provider';
import Button from '../ui/button';
import { router } from 'expo-router';
import type { TablesInsert, TablesUpdate } from '../../database.types';

type InsertTrip = TablesInsert<'trips'>;
type UpdateTrip = TablesUpdate<'trips'>;

type TripFormProps = {
  initialTrip?: DraftTrip;
  tripId?: string;
  setIsEditing?: React.Dispatch<React.SetStateAction<boolean>>;
};

// create a type
// because ex: location is string | null in db, but in <input> the value is string | undefined, therefore we can not use Trip type
type DraftTrip = {
  title: string;
  location: string;
  accommodation: string;
  dates: string;
  transport: string;
  gear_renting: string;
  notes: string;
};

export default function TripForm({ initialTrip, tripId, setIsEditing }: TripFormProps) {
  const [draftTrip, setDraftTrip] = useState<DraftTrip>(
    initialTrip || {
      title: '',
      location: '',
      accommodation: '',
      dates: '',
      transport: '',
      gear_renting: '',
      notes: '',
    }
  );

  const showSnackbar = useSnackbar();

  const handleChange = (key: keyof InsertTrip, value: string) => {
    setDraftTrip({ ...draftTrip, [key]: value });
  };

  const handleSave = async () => {
    const { data: userData } = await supabase.auth.getUser();
    const userId = userData?.user?.id;
    if (!userId) {
      showSnackbar('使用者未登入', { variant: 'error' });
      return;
    }

    const { title, location, accommodation, dates, transport, gear_renting, notes } = draftTrip;

    if (tripId) {
      // 編輯模式 → 用 UpdateTrip
      const updatePayload: UpdateTrip = {
        title,
        location,
        accommodation,
        dates,
        transport,
        gear_renting,
        notes,
      };

      const { error } = await supabase
        .from('trips')
        .update(updatePayload)
        .eq('id', tripId);

      if (error) {
        showSnackbar('儲存行程失敗: ' + error.message, { variant: 'error' });
        return;
      }

      showSnackbar('行程儲存成功', { variant: 'success' });
      setIsEditing?.(false);
    } else {
      // 新增模式 → 用 InsertTrip
      const insertPayload: InsertTrip = {
        user_id: userId,
        title,
        location,
        accommodation,
        dates,
        transport,
        gear_renting,
        notes,
      };

      const { data: newTrip, error } = await supabase
        .from('trips')
        .insert([insertPayload])
        .select()
        .single();

      if (error) {
        showSnackbar('儲存行程失敗: ' + error.message, { variant: 'error' });
        return;
      }

      // 新 trip 建立成功 → 插入 trip_participant
      const { error: participantError } = await supabase
        .from('trip_participants')
        .insert([{
          trip_id: newTrip.id,
          user_id: userId,
        }]);

      if (participantError) {
        showSnackbar('建立參加者失敗: ' + participantError.message, { variant: 'error' });
        return;
      }

      showSnackbar('行程儲存成功', { variant: 'success' });
      router.back();
    }

  };

  const handleCancel = () => {
    if (initialTrip) {
      setDraftTrip(initialTrip);
    } else {
      setDraftTrip({
        title: '',
        location: '',
        accommodation: '',
        dates: '',
        transport: '',
        gear_renting: '',
        notes: '',
      });
    }
    router.back();
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
        value={draftTrip.gear_renting}
        onChangeText={(text) => handleChange('gear_renting', text)}
      />
      <Input
        label='備註'
        value={draftTrip.notes}
        multiline
        onChangeText={(text) => handleChange('notes', text)}
      />

      <View style={{ flexDirection: 'row', gap: 8, marginVertical: 16 }}>
        <Button title='儲存' onPress={handleSave} />
        <Button type='outline' title='取消' onPress={handleCancel} />
      </View>
    </View>
  );
}