export type ChecklistRow = {
  created_at: string | null;
  data: Section[];
  id: string;
  member_id: string | null;
  member_name: string;
  trip_id: string;
  updated_at: string | null;
  user_id: string;
};

type Section = {
  title: string;
  options: Option[];
};

type Option = {
  title: string;
  checked: boolean;
};