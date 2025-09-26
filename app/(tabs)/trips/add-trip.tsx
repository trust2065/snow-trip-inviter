import { ScrollView } from 'react-native';
import AddTripForm from '../../../components/trip/add-trip-form';
export default function TabThreeScreen() {
  return (
    <ScrollView style={{ flex: 1, padding: 0 }}>
      <AddTripForm />
    </ScrollView>
  );
}