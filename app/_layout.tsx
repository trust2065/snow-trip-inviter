import { DarkTheme, DefaultTheme, ThemeProvider as NavThemeProvider } from '@react-navigation/native';
import { ThemeProvider as RNEThemeProvider, createTheme } from '@rneui/themed';

import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import Auth from '../components/auth';
import { UserContext } from './contexts/user-context';
import { User, AuthChangeEvent, Session } from '@supabase/supabase-js';
import supabase from './utils/supabase';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  const navTheme = colorScheme === 'dark' ? DarkTheme : DefaultTheme;
  const rneTheme = createTheme({
    mode: colorScheme === 'dark' ? 'dark' : 'light',
  });

  // 儲存使用者與 Session 狀態
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 初始化檢查
    const initAuth = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user ?? null);
      setLoading(false);
    };
    initAuth();

    // 訂閱登入 / 登出事件
    const { data: subscription } = supabase.auth.onAuthStateChange(
      (_event: AuthChangeEvent, session: Session | null) => {
        setUser(session?.user ?? null);
      }
    );

    return () => {
      subscription?.subscription.unsubscribe();
    };
  }, []);

  return (
    <NavThemeProvider value={navTheme}>
      <RNEThemeProvider theme={rneTheme}>
        <UserContext.Provider value={{ user }}>
          {loading ? (
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: rneTheme.mode === 'dark' ? '#000' : '#fff',
              }}
            >
              <ActivityIndicator size='large' />
            </View>
          ) : !user ? (
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: rneTheme.mode === 'dark' ? '#000' : '#fff',
              }}
            >
              <Auth />
            </View>
          ) : (
            <>
              <Stack>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
              </Stack>
              <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
            </>
          )}
        </UserContext.Provider>
      </RNEThemeProvider>
    </NavThemeProvider>
  );
}
