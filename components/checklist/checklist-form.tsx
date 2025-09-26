// ChecklistForm.tsx
import React, { useEffect, useState } from 'react';
import { View, ScrollView } from 'react-native';
import { Collapsible } from '../ui/collapsible';
import MyCheckbox from './checkbox';
import supabase from '../../app/utils/supabase';
import { useSnackbar } from '../../app/providers/snackbar-provider';
import { useUser } from '../../app/contexts/user-context';
import { MemberBubble } from './member-bubble';
import { Text, Input } from '@rneui/themed';
import Button from '../ui/button';


type OptionItem = { title: string; checked: boolean; };
type Section = { title: string; options: OptionItem[]; };
type ChecklistData = {
  id?: string;
  user_id: string;
  trip_id: string;
  member_id: string;  // 用 id 做唯一 key
  member_name: string;
  data: Section[];
};

type ChecklistProps = { tripId: string; };

export default function ChecklistForm({ tripId }: ChecklistProps) {
  const [sections, setSections] = useState<Section[]>([]);
  const [checklists, setChecklists] = useState<ChecklistData[]>([]);
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const [editingMemberId, setEditingMemberId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState<string>('');
  const [showSelectMemberUI, setShowSelectMemberUI] = useState(false);

  const { user } = useUser();
  const userId = user?.id;
  const showSnackbar = useSnackbar();

  const defaultChecklist: Section[] = [
    { title: '裝備', options: [{ title: '雪鏡', checked: false }, { title: '手套', checked: false }, { title: '帽子', checked: false }] },
    { title: '服裝', options: [{ title: '外套', checked: false }, { title: '褲子', checked: false }] },
    { title: '其他', options: [{ title: '住宿訂房', checked: false }, { title: '雪票', checked: false }] },
  ];

  const fetchChecklists = async () => {
    if (!tripId || !userId) return;

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
      setSelectedMemberId(data[0].member_id);
      setSections(data[0].data);
      setShowSelectMemberUI(data.length > 1);
    } else {
      // 初始化自己
      const initChecklist: ChecklistData = {
        user_id: userId,
        trip_id: tripId,
        member_id: crypto.randomUUID(), // 產生唯一 id
        member_name: '我',
        data: defaultChecklist,
      };
      setChecklists([initChecklist]);
      setSelectedMemberId(initChecklist.member_id);
      setSections(defaultChecklist);
    }
  };

  useEffect(() => { fetchChecklists(); }, [tripId]);

  const selectMember = (memberId: string) => {
    const checklist = checklists.find(c => c.member_id === memberId);
    if (!checklist) return;
    setSelectedMemberId(memberId);
    setSections(checklist.data);
  };

  const addMemberChecklist = async (name: string) => {
    if (!userId || !name) return;

    if (checklists.some(c => c.member_name === name)) {
      showSnackbar('成員名稱已存在', { variant: 'error' });
      return;
    }

    const newChecklist: ChecklistData = {
      user_id: userId,
      trip_id: tripId,
      member_id: crypto.randomUUID(),
      member_name: name,
      data: defaultChecklist,
    };

    const { error } = await supabase
      .from('checklist')
      .insert(newChecklist);

    if (error) {
      showSnackbar('新增成員失敗: ' + error.message, { variant: 'error' });
      return;
    }

    setChecklists([...checklists, newChecklist]);
    setSelectedMemberId(newChecklist.member_id);
    setSections(defaultChecklist);
  };

  const editMember = async (memberId: string, newName: string) => {
    if (!userId || !memberId) return;
    if (checklists.some(c => c.member_name === newName)) {
      showSnackbar('成員名稱已存在', { variant: 'error' });
      return;
    }

    const checklist = checklists.find(c => c.member_id === memberId);
    if (!checklist) return;

    const updated = { ...checklist, member_name: newName };

    const { error } = await supabase
      .from('checklist')
      .update({ member_name: newName })
      .eq('id', memberId);

    if (error) {
      showSnackbar('修改成員名稱失敗: ' + error.message, { variant: 'error' });
      return;
    }

    setChecklists(checklists.map(c => c.member_id === memberId ? updated : c));
    if (selectedMemberId === memberId) setSections(updated.data);
    setEditingMemberId(null);
  };

  const toggleOption = async (sectionIndex: number, optionIndex: number) => {
    if (!selectedMemberId) return;

    const checklist = checklists.find(c => c.member_id === selectedMemberId);
    if (!checklist) return;

    const newSections = [...checklist.data];
    newSections[sectionIndex].options[optionIndex].checked =
      !newSections[sectionIndex].options[optionIndex].checked;

    const { error } = await supabase
      .from('checklist')
      .update({ data: newSections })
      .eq('id', selectedMemberId);

    if (error) {
      showSnackbar('更新選項失敗: ' + error.message, { variant: 'error' });
      return;
    }

    setChecklists(checklists.map(c =>
      c.member_id === selectedMemberId ? { ...c, data: newSections } : c
    ));
    setSections(newSections);
  };

  return (
    <ScrollView style={{ gap: 16 }}>
      {!showSelectMemberUI && (
        <View style={{ flex: 1, marginBottom: 16 }}>
          <Button
            onPress={() => setShowSelectMemberUI(true)} title='新增成員'
          />
        </View>
      )}
      {showSelectMemberUI && (
        <>
          <View style={{ flex: 1, marginBottom: 16 }}>
            <Text>選擇成員</Text>
          </View>
          <View style={{ flexDirection: 'row', gap: 10, marginBottom: 32 }}>
            {checklists.map(c => (
              editingMemberId === c.member_id ? (
                <Input
                  key={c.member_id}
                  value={editingName}
                  onChangeText={setEditingName}
                  onSubmitEditing={() => editMember(c.member_id, editingName)}
                  containerStyle={{ flex: 1 }}
                />
              ) : (
                <MemberBubble
                  key={c.member_id}
                  name={c.member_name}
                  selected={selectedMemberId === c.member_id}
                  onPress={() => selectMember(c.member_id)}
                  onLongPress={() => {
                    setEditingMemberId(c.member_id);
                    setEditingName(c.member_name);
                  }}
                />
              )
            ))}
            <MemberBubble
              name='+'
              selected={false}
              onPress={() => addMemberChecklist(prompt('請輸入新成員名字') || '')}
            />
          </View>
        </>
      )}


      {sections.map((section, si) => (
        <Collapsible key={si} title={section.title} opened>
          {section.options.map((opt, oi) => (
            <MyCheckbox
              key={oi}
              title={opt.title}
              checked={opt.checked}
              onPress={() => toggleOption(si, oi)}
            />
          ))}
        </Collapsible>
      ))}
    </ScrollView>
  );
}