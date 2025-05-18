import {inject, Injectable} from '@angular/core';
import {SupabaseService} from './supabase.service';
import {Tables} from '../../../supabase_generated/database.types';

@Injectable({
  providedIn: 'root'
})
export class ContactsService {
  supabaseService = inject(SupabaseService)

  constructor() { }

  async getContacts(): Promise<Tables<"Users">[]> {
    const { data, error } = await this.supabaseService.supabaseClient
      .from('Users')
      .select('*');

    if (error) throw error;
    return data || [];
  }

  async getContactInfosOfUser(userId: string): Promise<Tables<"UserContactInfos">[]> {
    const { data, error } = await this.supabaseService.supabaseClient
      .from('UserContactInfos')
      .select('*')
      .eq('user_id', userId);

    if (error) throw error;
    return data || [];
  }
}
