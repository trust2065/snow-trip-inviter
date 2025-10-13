import { View } from 'react-native';

// 可重用的置中容器
export default function CenteredScreen({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {children}
    </View>
  );
}
