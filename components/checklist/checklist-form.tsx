import React, { useEffect, useState } from 'react';
import { Alert, View } from 'react-native';
import { Collapsible } from '../ui/collapsible';
import MyCheckbox from './checkbox';
import supabase from '../../app/utils/supabase';
import { useSnackbar } from '../../app/providers/snackbar-provider';

type OptionItem = {
  title: string;
  checked: boolean;
};

type Section = {
  title: string;
  options: OptionItem[];
};

export default function ChecklistForm() {
  const [loading, setLoading] = useState(true);
  const [sections, setSections] = useState<Section[]>([]);
  const showSnackbar = useSnackbar();

  const [userId, setUserId] = useState<string | null>(null);

  const defaultChecklist: Section[] = [
    {
      title: '裝備',
      options: [
        { title: '雪鏡', checked: false },
        { title: '手套', checked: false },
        { title: '帽子', checked: false },
      ],
    },
    {
      title: '服裝',
      options: [
        { title: '外套', checked: false },
        { title: '褲子', checked: false },
      ],
    },
    {
      title: '其他',
      options: [
        { title: '住宿訂房', checked: false },
        { title: '雪票', checked: false },
      ],
    },
  ];

  useEffect(() => {
    const fetchChecklist = async () => {
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
        .from('checklist')
        .select('id, data')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) {
        showSnackbar('讀取清單失敗: ' + error.message, { variant: 'error' });
      } else if (data) {
        setSections(data.data);
      } else {
        setSections(defaultChecklist);
      }

      setLoading(false);
    };

    fetchChecklist();
  }, []);

  //  toggle option 即時更新 state 並同步 DB
  const toggleOption = async (sectionIndex: number, optionIndex: number) => {
    const newSections = [...sections];
    newSections[sectionIndex].options[optionIndex].checked =
      !newSections[sectionIndex].options[optionIndex].checked;
    setSections(newSections);

    // 同步到 Supabase
    await supabase
      .from('checklist')
      .upsert(
        { user_id: userId, data: newSections },
        { onConflict: 'user_id' }
      );
  };

  return (
    <View style={{ gap: 16 }}>
      {sections.map((section, sectionIndex) => (
        <Collapsible
          key={sectionIndex}
          title={section.title}
          opened={true}
        >
          {section.options.map((item, optionIndex) => (
            <MyCheckbox
              key={optionIndex}
              title={item.title}
              checked={item.checked}
              onPress={() => toggleOption(sectionIndex, optionIndex)}
            />
          ))}
        </Collapsible>
      ))}
    </View>
  );
};