import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Collapsible } from '../ui/collapsible';
import MyCheckbox from './checkbox';
import supabase from '../../app/utils/supabase';
import { useSnackbar } from '../../app/providers/snackbar-provider';
import { useUser } from '../../app/contexts/user-context';
import { Member } from '../../app/(tabs)/checklist';
import { MemberBubble } from './member-bubble';

type OptionItem = {
  title: string;
  checked: boolean;
};

type Section = {
  title: string;
  options: OptionItem[];
};

type ChecklistData = {
  user_id: string;
  trip_id: string;
  member_name: string;
  data: Section[];
};

type ChecklistProps = {
  tripId: string;
  members: Member[];
};

export default function ChecklistForm({ tripId, members }: ChecklistProps) {
  const [loading, setLoading] = useState(true);
  const [sections, setSections] = useState<Section[]>([]);
  const [checklists, setChecklists] = useState<ChecklistData[]>([]);
  const [selectedMember, setSelectedMember] = useState<string | null>(null);
  const [newMemberName, setNewMemberName] = useState('');

  const showSnackbar = useSnackbar();
  const { user } = useUser();
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

  const fetchChecklists = async () => {
    if (!tripId || !userId) return;
    setLoading(true);

    const { data, error } = await supabase
      .from('checklist')
      .select('*')
      .eq('trip_id', tripId)
      .eq('user_id', userId)
      .order('member_name', { ascending: true });

    if (error) {
      showSnackbar('讀取 checklist 失敗: ' + error.message, { variant: 'error' });
    } else if (data.length > 0) {
      setChecklists(data as ChecklistData[]);
      setSelectedMember(data[0].member_name);
      setSections((data[0] as ChecklistData).data);
    } else {
      const initMemberName = '我';
      // 初始化一個隊長自己的 checklist
      const initial: ChecklistData = {
        user_id: userId,
        trip_id: tripId,
        member_name: initMemberName,
        data: defaultChecklist,
      };
      setChecklists([initial]);
      setSelectedMember(initMemberName);
      setSections(defaultChecklist);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchChecklists();
  }, [tripId]);

  // 切換成員
  const selectMember = (memberName: string) => {
    const checklist = checklists.find((c) => c.member_name === memberName);
    if (checklist) {
      setSelectedMember(memberName);
      setSections(checklist.data);
    }
  };

  // 新增成員 checklist
  const addMemberChecklist = async () => {
    if (!newMemberName || !userId) return;

    const exists = checklists.find((c) => c.member_name === newMemberName);
    if (exists) {
      showSnackbar('成員名稱已存在', { variant: 'error' });
      return;
    }

    const newChecklist: ChecklistData = {
      user_id: userId,
      trip_id: tripId,
      member_name: newMemberName,
      data: defaultChecklist,
    };

    const { error } = await supabase
      .from('checklist')
      .upsert(newChecklist, { onConflict: 'user_trip_member_unique' });

    if (error) {
      showSnackbar('新增成員 checklist 失敗: ' + error.message, { variant: 'error' });
    } else {
      setChecklists([...checklists, newChecklist]);
      setSelectedMember(newMemberName);
      setSections(defaultChecklist);
      setNewMemberName('');
    }
  };

  // 編輯成員名字
  const editMember = async (id: string, newName: string) => {
    if (!userId) return;

    // 檢查名字是否重複
    const exists = checklists.find((c) => c.member_name === newName);
    if (exists) {
      showSnackbar('成員名稱已存在', { variant: 'error' });
      return;
    }

    // 找到要更新的 checklist
    const checklist = checklists.find((c) => c.member_name === id);
    if (!checklist) return;

    const updatedChecklist: ChecklistData = {
      ...checklist,
      member_name: newName,
    };

    const { error } = await supabase
      .from('checklist')
      .upsert(updatedChecklist, { onConflict: 'user_trip_member_unique' });

    if (error) {
      showSnackbar('修改成員名稱失敗: ' + error.message, { variant: 'error' });
      return;
    }

    // 更新 local state
    const updatedChecklists = checklists.map((c) =>
      c.member_name === id ? updatedChecklist : c
    );
    setChecklists(updatedChecklists);
    setSelectedMember(newName);
    setSections(updatedChecklist.data);
  };

  // toggle option
  const toggleOption = async (sectionIndex: number, optionIndex: number) => {
    const newSections = [...sections];
    newSections[sectionIndex].options[optionIndex].checked =
      !newSections[sectionIndex].options[optionIndex].checked;
    setSections(newSections);

    if (!userId || !selectedMember) return;

    await supabase
      .from('checklist')
      .upsert(
        {
          user_id: userId,
          trip_id: tripId,
          member_name: selectedMember,
          data: newSections,
        },
        { onConflict: 'user_trip_member_unique' }
      );
  };

  return (
    <ScrollView style={{ gap: 16 }}>
      <View style={{ flexDirection: 'row', gap: 10, marginBottom: 32 }}>
        {checklists.map((c) => (
          <MemberBubble
            key={c.member_name}
            name={c.member_name}
            selected={selectedMember === c.member_name}
            onPress={() => selectMember(c.member_name)}
          />
        ))}

        <MemberBubble
          name='+'
          selected={false}
          onPress={() => setNewMemberName('')}
        />
      </View>


      {sections.map((section, sectionIndex) => (
        <Collapsible key={sectionIndex} title={section.title} opened>
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
    </ScrollView>
  );
}