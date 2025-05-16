import {inject, Injectable} from '@angular/core';
import {SupabaseService} from './supabase.service';
import {Tables} from '../../../supabase_generated/database.types';

@Injectable({
  providedIn: 'root'
})
export class CalendarsService {
  supabaseService = inject(SupabaseService)
  constructor() { }

  async getCalendars(): Promise<Tables<"Calendars">[]> {
    const { data, error } = await this.supabaseService.supabaseClient
      .from('calendar')
      .select('*');
    if (error) {
      console.error('Error fetching calendars:', error);
      return [];
    }
    return data as Tables<"Calendars">[];
  }

  async getCalendarEvents(calendarId: number): Promise<Tables<"Events">[]> {
    const { data, error } = await this.supabaseService.supabaseClient
      .from('calendar_events')
      .select('*')
      .eq('calendar_id', calendarId);
    if (error) {
      console.error('Error fetching calendar events:', error);
      return [];
    }
    return data as Tables<"Events">[];
  }

  async getCalendarsEvents(calendarIds: number[]): Promise<Tables<"Events">[]> {
    const { data, error } = await this.supabaseService.supabaseClient
      .from('calendar_events')
      .select('*')
      .in('calendar_id', calendarIds);
    if (error) {
      console.error('Error fetching calendar events:', error);
      return [];
    }
    return data as Tables<"Events">[];
  }
}
