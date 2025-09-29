// ChecklistForm.tsx
import React, { useEffect, useState } from 'react';
import { View, ScrollView } from 'react-native';
import { Text, Input } from '@rneui/themed';
import { Collapsible } from '../ui/collapsible';
import MyCheckbox from './checkbox';
import { MemberBubble } from './member-bubble';
import Button from '../ui/button';
import supabase from '../../app/utils/supabase';
import { useSnackbar } from '../../app/providers/snackbar-provider';
import { useUser } from '../../app/contexts/user-context';

// ---------- Types ----------
type OptionItem = { title: string; checked: boolean; };
type Section = { title: string; options: OptionItem[]; };
type ChecklistData = {
  id?: string;
  user_id: string;
  trip_id: string;
  member_id: string;
  member_name: string;
  data: Section[];
};

type ChecklistProps = { tripId: string; };

// ---------- Component ----------
export default function ChecklistForm({ tripId }: ChecklistProps) {
  const [sections, setSections] = useState<Section[]>([]);
  const [checklists, setChecklists] = useState<ChecklistData[]>([]);
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const [editingMemberId, setEditingMemberId] = useState<string | null>(null);
  const [addingMember, setAddingMember] = useState(false);
  const [editingName, setEditingName] = useState<string>('');
  const [showSelectMemberUI, setShowSelectMemberUI] = useState(false);

  const { user } = useUser();
  const userId = user?.id;
  const showSnackbar = useSnackbar();

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

  // ---------- Fetch ----------
  const fetchChecklists = async () => {
    if (!tripId || !userId) return;

    // user A is admin, has a checklist in trip 1
    // user B is guest, has a checklist in trip 1
    // user A, B should see both checklists
    const { data, error } = await supabase
      .from('checklist')
      .select('*')
      .eq('trip_id', tripId)
      .order('created_at', { ascending: true });

    if (error) {
      showSnackbar('讀取 checklist 失敗: ' + error.message, {
        variant: 'error',
      });
      return;
    }

    if (data.length > 0) {
      setChecklists(data as ChecklistData[]);
      setSelectedMemberId(data[0].member_id);
      setSections(data[0].data);
      setShowSelectMemberUI(data.length > 1);
    } else {
      const initChecklist: ChecklistData = {
        user_id: userId,
        trip_id: tripId,
        member_id: crypto.randomUUID(),
        member_name: '我',
        data: defaultChecklist,
      };
      setChecklists([initChecklist]);
      setSelectedMemberId(initChecklist.member_id);
      setSections(defaultChecklist);
    }
  };

  useEffect(() => {
    fetchChecklists();
  }, [tripId]);

  // ---------- Actions ----------
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

    const { error } = await supabase.from('checklist').insert(newChecklist);

    if (error) {
      showSnackbar('新增成員失敗: ' + error.message, { variant: 'error' });
      return;
    }

    setChecklists([...checklists, newChecklist]);
    setSelectedMemberId(newChecklist.member_id);
    setSections(defaultChecklist);
    setEditingName('');
    setAddingMember(false);
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
      .eq('id', checklist.id);

    if (error) {
      showSnackbar('修改成員名稱失敗: ' + error.message, { variant: 'error' });
      return;
    }

    setChecklists(
      checklists.map(c => (c.member_id === memberId ? updated : c))
    );
    if (selectedMemberId === memberId) setSections(updated.data);
    setEditingMemberId(null);
    setEditingName('');
  };

  const toggleOption = async (sectionIndex: number, optionIndex: number) => {
    if (!selectedMemberId) return;

    const checklist = checklists.find(c => c.member_id === selectedMemberId);
    if (!checklist) return;

    const newSections = [...checklist.data];
    newSections[sectionIndex].options[optionIndex].checked =
      !newSections[sectionIndex].options[optionIndex].checked;

    if (!checklist.id) {
      console.log('no checklist id, should not happen.');
      return;
    }

    const { data: updated, error } = await supabase
      .from('checklist')
      .update({ data: newSections })
      .eq('id', checklist.id)
      .select()
      .single();

    if (error) {
      showSnackbar('更新選項失敗: ' + error.message, { variant: 'error' });
      return;
    }

    // 使用 DB 回傳結果更新 state
    setChecklists(prev =>
      prev.map(c =>
        c.member_id === selectedMemberId ? (updated as ChecklistData) : c
      )
    );
    setSections((updated as ChecklistData).data);
  };

  // ---------- Render ----------
  return (
    <ScrollView style={{ gap: 16 }}>
      {!showSelectMemberUI && (
        <View style={{ flex: 1, marginBottom: 16 }}>
          <Button
            onPress={() => setShowSelectMemberUI(true)}
            title='新增成員'
          />
        </View>
      )}

      {showSelectMemberUI && (
        <>
          <View style={{ flex: 1, marginBottom: 16 }}>
            <Text>選擇成員</Text>
          </View>

          <View
            style={{
              flexDirection: 'row',
              gap: 10,
              marginBottom: 32,
            }}
          >
            {checklists.map(c => (
              <MemberBubble
                key={c.member_id}
                name={c.member_name}
                selected={c.member_id === selectedMemberId}
                onPress={() => selectMember(c.member_id)}
                onLongPress={() => {
                  setEditingMemberId(c.member_id);
                  setEditingName(c.member_name);
                }}
              />
            ))}

            <MemberBubble
              name='+'
              selected={false}
              onPress={() => setAddingMember(true)}
            />
          </View>

          {addingMember && (
            <View
              style={{
                marginBottom: 16,
                flexDirection: 'row',
                gap: 10,
                alignItems: 'center',
              }}
            >
              <Text>新成員名稱:</Text>
              <Input
                value={editingName}
                onChangeText={setEditingName}
                onSubmitEditing={() => addMemberChecklist(editingName)}
                returnKeyType='done'
                containerStyle={{ maxWidth: 200 }}
              />
              <Button
                onPress={() => setAddingMember(false)}
                title='取消'
                type='outline'
                width={60}
              />
            </View>
          )}

          {editingMemberId && (
            <View
              style={{
                marginBottom: 16,
                flexDirection: 'row',
                gap: 10,
                alignItems: 'center',
              }}
            >
              <Text>新成員名稱:</Text>
              <Input
                value={editingName}
                onChangeText={setEditingName}
                onSubmitEditing={() =>
                  editMember(editingMemberId, editingName)
                }
                returnKeyType='done'
                containerStyle={{ maxWidth: 200 }}
              />
              <Button
                onPress={() => setEditingMemberId(null)}
                title='取消'
                type='outline'
                width={60}
              />
            </View>
          )}
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