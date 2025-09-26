import { Stack } from 'expo-router';

export default function TripLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{ title: 'My Trips' }}
      />
      <Stack.Screen
        name="add-trip"
        options={{ title: '新行程' }}
      />
      {/* <Stack.Screen
        name="[id]"
        options={{ title: 'Trip Detail' }}
      /> */}
    </Stack>
  );
}