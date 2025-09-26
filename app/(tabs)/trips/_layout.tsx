import { Stack } from 'expo-router';

export default function TripLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{ title: 'My Trips', headerShown: false }}
      />
      <Stack.Screen
        name="add-trip"
        options={{ title: '新行程' }}
      />
      <Stack.Screen
        name="edit/[id]"
        options={{ title: '編輯行程' }}
      />
      <Stack.Screen
        name="details/[id]"
        options={{ title: '行程詳情' }}
      />
    </Stack>
  );
}