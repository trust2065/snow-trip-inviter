import { ScrollView } from 'react-native';
import TripForm from '../../../components/trip/trip-form';
export default function TabThreeScreen() {
  return (
    <ScrollView style={{ flex: 1, padding: 0 }}>
      <TripForm />
    </ScrollView>
  );
}