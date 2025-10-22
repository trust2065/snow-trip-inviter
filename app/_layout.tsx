import { DarkTheme, DefaultTheme, ThemeProvider as NavThemeProvider } from '@react-navigation/native';
import { ThemeProvider as RNEThemeProvider, createTheme } from '@rneui/themed';

import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import Auth from '../components/auth';
import UserContext, { UserWithRole } from './contexts/user-context';
import { User, AuthChangeEvent, Session } from '@supabase/supabase-js';
import supabase from './utils/supabase';
import SnackbarProvider from './providers/snackbar-provider';
import CenteredScreen from '../components/centered-screen';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

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

  const [user, setUser] = useState<UserWithRole | null>(null);
  const [loading, setLoading] = useState(true);

  const getUserWithRole = async (user: User): Promise<UserWithRole> => {
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profileError) {
      console.error('取得角色失敗', profileError);
    }

    return {
      ...user,
      role: profile?.role || 'user'
    };
  };

  useEffect(() => {
    const initAuth = async () => {
      const { data } = await supabase.auth.getUser();

      if (!!data.user) {
        const userWithRole = await getUserWithRole(data.user);
        setUser(userWithRole);
      }

      setLoading(false);
    };

    initAuth();

    const { data: subscription } = supabase.auth.onAuthStateChange(
      async (_event: AuthChangeEvent, session: Session | null) => {
        if (session?.user) {
          const userWithRole = await getUserWithRole(session.user);
          setUser(userWithRole);
        } else {
          setUser(null);
        }
      }
    );

    return () => {
      subscription?.subscription.unsubscribe();
    };
  }, []);

  const bgColor = isDarkTheme ? rneTheme.darkColors?.background ?? 'black' : rneTheme.lightColors?.background ?? 'white';

  return (
    <SafeAreaProvider>
      <SnackbarProvider>
        <NavThemeProvider value={navTheme}>
          <RNEThemeProvider theme={rneTheme}>
            <UserContext.Provider value={{ user }}>
              <SafeAreaView edges={['top', 'left', 'right']} style={{ flex: 1, backgroundColor: bgColor }}>
                {loading ? (
                  <CenteredScreen >
                    <ActivityIndicator size='large' />
                  </CenteredScreen>
                ) : !user ? (
                  <CenteredScreen >
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
              </SafeAreaView>
            </UserContext.Provider>
          </RNEThemeProvider>
        </NavThemeProvider>
      </SnackbarProvider>
    </SafeAreaProvider>
  );
}