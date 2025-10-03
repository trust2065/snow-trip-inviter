import { DarkTheme, DefaultTheme, ThemeProvider as NavThemeProvider } from '@react-navigation/native';
import { ThemeProvider as RNEThemeProvider, createTheme } from '@rneui/themed';

import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import Auth from '../components/auth';
import UserContext from './contexts/user-context';
import { User, AuthChangeEvent, Session } from '@supabase/supabase-js';
import supabase from './utils/supabase';
import SnackbarProvider from './providers/snackbar-provider';
import CenteredScreen from '../components/centered-screen';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const isDarkTheme = colorScheme === 'dark';

  const navTheme = isDarkTheme ? DarkTheme : DefaultTheme;
  const rneTheme = createTheme({
    mode: isDarkTheme ? 'dark' : 'light',
  });

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const { data } = await supabase.auth.getUser();

      if (!!data.user) {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.user?.id)
          .single();

        if (profileError) {
          console.error('取得角色失敗', profileError);
        }

        const userWithRole = data.user
          ? { ...data.user, role: profile?.role || 'user' }
          : null;

        setUser(userWithRole);
      }

      setLoading(false);
    };
    initAuth();

    const { data: subscription } = supabase.auth.onAuthStateChange(
      (_event: AuthChangeEvent, session: Session | null) => {
        setUser(session?.user ?? null);
      }
    );

    return () => {
      subscription?.subscription.unsubscribe();
    };
  }, []);

  const bgColor = isDarkTheme ? rneTheme.darkColors?.background ?? 'black' : rneTheme.lightColors?.background ?? 'white';

  return (
    <SnackbarProvider>
      <NavThemeProvider value={navTheme}>
        <RNEThemeProvider theme={rneTheme}>
          <UserContext.Provider value={{ user }}>
            {loading ? (
              <CenteredScreen backgroundColor={bgColor}>
                <ActivityIndicator size='large' />
              </CenteredScreen>
            ) : !user ? (
              <CenteredScreen backgroundColor={bgColor}>
                <Auth />
              </CenteredScreen>
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
    </SnackbarProvider>
  );
}