import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { Collapsible } from '../ui/collapsible';
import MyCheckbox from './checkbox';
import supabase from '../../app/utils/supabase';
import { useSnackbar } from '../../app/providers/snackbar-provider';
import { useUser } from '../../app/contexts/user-context';

type OptionItem = {
  title: string;
  checked: boolean;
};

type Section = {
  title: string;
  options: OptionItem[];
};

type ChecklistProps = {
  tripId: string;  // 新增 tripId
};

export default function ChecklistForm({ tripId }: ChecklistProps) {
  const [loading, setLoading] = useState(true);
  const [sections, setSections] = useState<Section[]>([]);
  const showSnackbar = useSnackbar();
  const { user } = useUser();
  console.log(tripId);

  const userId = user?.id;

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
      if (!tripId) return;

      if (!userId) {
        console.log('User not logged in');
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('checklist')
        .select('id, data')
        .eq('user_id', userId)
        .eq('trip_id', tripId)
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
  }, [tripId]);

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
        { user_id: userId, trip_id: tripId, data: newSections },
        { onConflict: 'user_trip_unique' }
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