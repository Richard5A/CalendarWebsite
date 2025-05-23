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

  async getSharingInformationOfThisUser(): Promise<{
    user: Tables<"Users">,
    userContactInfos: Tables<"UserContactInfos">[]
    sharings: {
      group: Tables<"PersonalUPermissionGroups">
      users: Tables<"UserPersonalUPermissionGroups">[]
      roles: Tables<"RolePersonalUPermissionsGroups">[]
      permissions: Tables<"PersonalUGroupsContactInfoPermissions">[]
    }[]
  }> {
    const { data: user, error: userError } = await this.supabaseService.supabaseClient
      .from('Users')
      .select('*')
      .eq('id', this.supabaseService.userId)
      .single();

    if (userError) throw userError;
    if (user === null) throw new Error("User not found");

    const { data: personalupermissiongroups, error: error2 } = await this.supabaseService.supabaseClient
      .from("PersonalUPermissionGroups")
      .select('*')
      .eq('owner', user?.id);

    if (error2) throw error2;
    if (personalupermissiongroups === null) throw new Error("No personal permission groups found");
    const pupgIds = personalupermissiongroups.map(pupg => pupg.id);

    const { data: userContactInfos, error: error3 } = await this.supabaseService.supabaseClient
      .from('UserContactInfos')
      .select('*')
      .eq('user_id', user.id);

    if (error3) throw error3;
    if (userContactInfos === null) throw new Error("No user contact infos found");

    const { data: userPersonalUPermissionGroups, error: error4 } = await this.supabaseService.supabaseClient
      .from('UserPersonalUPermissionGroups')
      .select('*')
      .in('personal_u_permission_group_id', pupgIds);

    if (error4) throw error4;
    if (userPersonalUPermissionGroups === null) throw new Error("No user personal permission groups found");
  }
}
