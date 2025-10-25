import { supabase } from '../config/supabase';
import { MeetingAssistant } from '../types/database';

export class DatabaseService {
  // Get all meeting assistants
  static async getAll(): Promise<MeetingAssistant[]> {
    const { data, error } = await supabase
      .from('meeting_assistants')
      .select('*')
      .order('date', { ascending: true });

    if (error) {
      throw new Error(`Failed to fetch meeting assistants: ${error.message}`);
    }

    return data || [];
  }

  // Get meeting assistant by date
  static async getByDate(date: string): Promise<MeetingAssistant | null> {
    const { data, error } = await supabase
      .from('meeting_assistants')
      .select('*')
      .eq('date', date)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows found
      throw new Error(`Failed to fetch meeting assistant: ${error.message}`);
    }

    return data;
  }

  // Get meeting assistant by ID
  static async getById(id: number): Promise<MeetingAssistant | null> {
    const { data, error } = await supabase
      .from('meeting_assistants')
      .select('*')
      .eq('id', id)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw new Error(`Failed to fetch meeting assistant: ${error.message}`);
    }

    return data;
  }

  // Add new meeting assistant
  static async add(assistant: {
    date: string;
    usher1: string;
    usher2: string;
    sacrament1: string;
    sacrament2: string;
  }): Promise<MeetingAssistant> {
    const { data, error } = await supabase
      .from('meeting_assistants')
      .insert(assistant as any)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to add meeting assistant: ${error.message}`);
    }

    return data;
  }

  // Update meeting assistant
  static async update(id: number, updates: {
    date?: string;
    usher1?: string;
    usher2?: string;
    sacrament1?: string;
    sacrament2?: string;
  }): Promise<MeetingAssistant> {
    const { data, error } = await supabase
      .from('meeting_assistants')
      .update(updates as any)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to update meeting assistant: ${error.message}`);
    }

    return data;
  }

  // Delete meeting assistant
  static async delete(id: number): Promise<void> {
    const { error } = await supabase
      .from('meeting_assistants')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(`Failed to delete meeting assistant: ${error.message}`);
    }
  }
}