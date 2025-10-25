export interface MeetingAssistant {
  id: number;
  date: string; // YYYY-MM-DD format
  usher1: string;
  usher2: string;
  sacrament1: string;
  sacrament2: string;
  created_at: string;
}

export interface Database {
  public: {
    Tables: {
      meeting_assistants: {
        Row: MeetingAssistant;
        Insert: Omit<MeetingAssistant, 'id' | 'created_at'>;
        Update: Partial<Omit<MeetingAssistant, 'id' | 'created_at'>>;
      };
    };
  };
}
