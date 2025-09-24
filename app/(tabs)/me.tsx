import { Image } from 'expo-image';
import { ActivityIndicator, Alert, StyleSheet, View } from 'react-native';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { useEffect, useState } from 'react';
import Button from '../../components/ui/button';
import supabase from '../utils/supabase';
import { Input, Text } from '@rneui/themed';
import Auth from '../../components/auth';
import NumericInput from '../../components/ui/numeric-input';
import { useSnackbar } from '../providers/snackbar-provider';

export default function HomeScreen() {
  const [snowboard, setSnowboard] = useState<{ length: number; comment?: string; id: string; } | null>(null);
  const [loading, setLoading] = useState(true);
  const [snowboardForm, setSnowboardForm] = useState({
    length: '',
    comment: '',
  });
  const [userId, setUserId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const showSnackbar = useSnackbar();

  useEffect(() => {
    const fetchSnowboard = async () => {
      setLoading(true);

      const { data: userData } = await supabase.auth.getUser();
      setUserId(userData?.user?.id || null);
      const userId = userData?.user?.id;
      if (!userId) {
        console.log('User not logged in');
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('snowboards')
        .select('id, length, comment')
        .eq('user_id', userId)
        .limit(1)
        .maybeSingle();

      if (error) {
        showSnackbar('讀取失敗: ' + error.message, { variant: 'error' });
      } else if (data) {
        setSnowboard(data);
      }

      setLoading(false);
    };

    fetchSnowboard();
  }, []);

  const deleteSnowboard = async () => {
    if (!snowboard) return;

    setLoading(true);
    try {
      const { error } = await supabase.from('snowboards').delete().eq('id', snowboard.id);
      if (error) {
        showSnackbar('刪除失敗: ' + error.message, { variant: 'error' });
      } else {
        setSnowboard(null);
      }
    } finally {
      setLoading(false);
    }
  };

  function toggleEdit() {
    setIsEditing(!isEditing);
  }

  const addSnowboard = async () => {
    setLoading(true);
    try {
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData?.user?.id;
      if (!userId) {
        showSnackbar('請先登入', { variant: 'error' });
        return;
      }

      const lengthNum = parseInt(snowboardForm.length, 10);
      if (isNaN(lengthNum) || lengthNum <= 0) {
        showSnackbar('請輸入有效長度', { variant: 'error' });
        return;
      }

      const { data, error } = await supabase
        .from('snowboards')
        .insert([
          {
            user_id: userId,
            brand: 'Burton',
            model: 'Custom',
            length: lengthNum,
          },
        ])
        .select()
        .single();

      if (error) {
        showSnackbar('新增失敗: ' + error.message, { variant: 'error' });
      } else {
        setSnowboard(data);
        showSnackbar('新增成功', { variant: 'success' });
      }
    } finally {
      setLoading(false);
    }
  };

  const updateSnowboard = async () => {
    if (!snowboard) {
      console.log('No snowboard to update');
      return;
    }

    const lengthNum = parseInt(snowboardForm.length, 10);
    if (isNaN(lengthNum) || lengthNum <= 0) {
      showSnackbar('請輸入有效長度', { variant: 'error' });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('snowboards')
        .update({ length: lengthNum, comment: snowboardForm.comment || null })
        .eq('id', snowboard.id)
        .select()
        .single();

      if (error) {
        showSnackbar('更新失敗: ' + error.message, { variant: 'error' });
      } else {
        setSnowboard(data);
        setIsEditing(false);
        setSnowboardForm({ length: '', comment: '' });
        showSnackbar('更新成功', { variant: 'success' });
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <View style={styles.container}>
      <ActivityIndicator size='large' color='#A1CEDC' />
    </View>
  );

  if (!userId) {
    return (
      <View style={styles.container}>
        登入
        <Auth />
      </View>
    );
  }

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/partial-react-logo.png')}
          style={styles.reactLogo}
        />
      }>
      <View style={{ padding: 20 }}>
        {(snowboard) ? (
          <>
            {isEditing ? (
              <SnowboardForm
                form={snowboardForm}
                onChange={(field, value) =>
                  setSnowboardForm(prev => ({ ...prev, [field]: value }))
                }
                onSubmit={updateSnowboard}
                onCancel={() => setIsEditing(false)}
              />
            ) : (
              <View style={styles.gaps}>
                <Text>雪板長度: {snowboard.length}</Text>
                {snowboard.comment ? <Text>備註: {snowboard.comment}</Text> : null}
                <View style={styles.buttons}>
                  <Button
                    title='編輯'
                    onPress={() => {
                      setSnowboardForm({
                        length: String(snowboard.length),
                        comment: snowboard.comment || ''
                      });
                      setIsEditing(true);
                    }}
                  />
                  {/* <Button title='刪除 ' onPress={deleteSnowboard} /> */}
                </View>
              </View>
            )}
          </>
        ) : (
          <SnowboardForm
            form={snowboardForm}
            onChange={(field, value) =>
              setSnowboardForm(prev => ({ ...prev, [field]: value }))
            }
            onSubmit={addSnowboard}
            submitLabel='新增雪板'
          />
        )}
      </View>
    </ParallaxScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,                  // 撐滿整個螢幕
    justifyContent: 'center', // 垂直置中
    alignItems: 'center',     // 水平置中
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  flex: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  buttons: { flexDirection: 'row', gap: 16 },
  gaps: { gap: 16 },
});

type SnowboardFormProps = {
  form: { length: string; comment: string; };
  onChange: (field: 'length' | 'comment', value: string) => void;
  onSubmit: () => void;
  onCancel?: () => void;
  submitLabel?: string;
};

function SnowboardForm({ form, onChange, onSubmit, onCancel, submitLabel = '儲存' }: SnowboardFormProps) {
  return (
    <View>
      <NumericInput
        label='雪板長度'
        placeholder='長度'
        value={form.length}
        onChange={text => onChange('length', text)}
      />
      <Input
        label='備註'
        placeholder='備註'
        value={form.comment}
        onChangeText={text => onChange('comment', text)}
      />
      <View style={{ flexDirection: 'row', gap: 10 }}>
        {onCancel && <Button title='取消' onPress={onCancel} type='outline' />}
        <Button title={submitLabel} onPress={onSubmit} />
      </View>
    </View>
  );
}