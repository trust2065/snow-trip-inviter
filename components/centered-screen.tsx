import { View } from 'react-native';

// 可重用的置中容器
export default function CenteredScreen({
  children,
  backgroundColor,
}: {
  children: React.ReactNode;
  backgroundColor: string;
}) {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor,
      }}
    >
      {children}
    </View>
  );
}
