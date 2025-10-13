// ChecklistForm.tsx
import React, { useEffect, useState } from 'react';
import { View, ScrollView } from 'react-native';
import { Text, Input } from '@rneui/themed';
import { Collapsible } from '../ui/collapsible';
import MyCheckbox from './checkbox';
import Button from '../ui/button';
import supabase from '../../app/utils/supabase';
import { useSnackbar } from '../../app/providers/snackbar-provider';
import { useUser } from '../../app/contexts/user-context';
import { SelectableBubble } from './selectable-bubble';

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
    // member(not user) B is guest, has a checklist in trip 1
    // user A should see both checklists
    // member would not able to login in current design
    const { data, error } = await supabase
      .from('checklist')
      .select('*')
      .eq('trip_id', tripId)
      .eq('user_id', userId)
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

      const { data: inserted, error: insertError } = await supabase
        .from('checklist')
        .insert(initChecklist)
        .select()
        .single();

      if (insertError) {
        showSnackbar('建立 checklist 失敗: ' + insertError.message, {
          variant: 'error',
        });
        return;
      }

      setChecklists([inserted as ChecklistData]);
      setSelectedMemberId(inserted.member_id);
      setSections(inserted.data);
    }
  };

  useEffect(() => {
    fetchChecklists();
  }, [tripId]);

  // ---------- Actions ----------
  const isChecklistDone = (checklist: ChecklistData) => {
    return checklist.data.every(section =>
      section.options.every(opt => opt.checked)
    );
  };

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

    const { data: inserted, error } = await supabase
      .from('checklist')
      .insert(newChecklist)
      .select()
      .single();

    if (error) {
      showSnackbar('新增成員失敗: ' + error.message, { variant: 'error' });
      return;
    }

    setChecklists([...checklists, inserted as ChecklistData]);
    setSelectedMemberId(inserted.member_id);
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

    // 假設有user A, user B, member C
    // user A加了member C

    // 每個checklist有記錄user_id(隊長) 與 trip_id
    // A登入時 要找到的是 A和C的checklist
    // B登入時 要找到的是 B的checklist 
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
              <SelectableBubble
                key={c.member_id}
                name={c.member_name}
                selected={c.member_id === selectedMemberId}
                onPress={() => selectMember(c.member_id)}
                onLongPress={() => {
                  setEditingMemberId(c.member_id);
                  setEditingName(c.member_name);
                }}
                showTick={isChecklistDone(c)}
              />
            ))}

            <SelectableBubble
              name='+'
              selected={false}
              onPress={() => setAddingMember(true)}
            />
          </View>

          {addingMember && (
            <MemberForm
              value={editingName}
              onChange={setEditingName}
              onSubmit={() => addMemberChecklist(editingName)}
              onCancel={() => setAddingMember(false)}
            />
          )}

          {editingMemberId && (
            <MemberForm
              value={editingName}
              onChange={setEditingName}
              onSubmit={() => editMember(editingMemberId, editingName)}
              onCancel={() => setEditingMemberId(null)}
            />
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

function MemberForm({
  value,
  onChange,
  onSubmit,
  onCancel,
  label = '新成員名稱:',
}: {
  value: string;
  onChange: (text: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
  label?: string;
}) {
  return (
    <View style={{ marginBottom: 32 }}>
      <View style={{ flex: 1, flexDirection: 'row', alignItems: 'baseline' }}>
        <Text>{label}</Text>
        <Input
          value={value}
          onChangeText={onChange}
          onSubmitEditing={onSubmit}
          returnKeyType='done'
          containerStyle={{ maxWidth: 200 }}
        />
      </View>
      <Button onPress={onCancel} title='取消' type='outline' width={60} />
    </View>
  );
}