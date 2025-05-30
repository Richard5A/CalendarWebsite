import {inject, Injectable} from '@angular/core';
import {SupabaseService} from './supabase.service';
import {Tables} from '../../../supabase_generated/database.types';

export interface ContactSharingInformation {
  user: Tables<"Users">,
  userContactInfos: Map<number, Tables<"UserContactInfos">[]>,
  roles: Map<string, Tables<"Roles">>,
  users: Map<string, Tables<"Users">>,
  sharings: {
    group: Tables<"PersonalUPermissionGroups">
    users: Tables<"UserPersonalUPermissionGroups"> []
    roles: Tables<"RolePersonalUPermissionsGroups"> []
    permissions: Tables<"PersonalUGroupsContactInfoPermissions"> []
  }[]
}

@Injectable({
  providedIn: 'root'
})
export class ContactsService {
  supabaseService = inject(SupabaseService)

  constructor() {
  }

  async getContacts(): Promise<Tables<"Users">[]> {
    const {data, error} = await this.supabaseService.supabaseClient
      .from('Users')
      .select('*');

    if (error) throw error;
    return data || [];
  }

  async getContactInfosOfUser(userId: string): Promise<Tables<"UserContactInfos">[]> {
    const {data, error} = await this.supabaseService.supabaseClient
      .from('UserContactInfos')
      .select('*')
      .eq('user_id', userId);

    if (error) throw error;
    return data || [];
  }

  async getSharingInformationOfThisUser(): Promise<ContactSharingInformation> {
    const {data: user, error: userError} = await this.supabaseService.supabaseClient
      .from('Users')
      .select('*')
      .eq('id', this.supabaseService.userId)
      .single();

    if (userError) throw userError;
    if (user === null) throw new Error("User not found");

    const {data: personalupermissiongroups, error: error2} = await this.supabaseService.supabaseClient
      .from("PersonalUPermissionGroups")
      .select('*')
      .eq('owner', user?.id);

    if (error2) throw error2;
    if (personalupermissiongroups === null) throw new Error("No personal permission groups found");
    const pupgIds = personalupermissiongroups.map(pupg => pupg.id);

    const {data: userContactInfos, error: error3} = await this.supabaseService.supabaseClient
      .from('UserContactInfos')
      .select('*')
      .eq('user_id', user.id);

    if (error3) throw error3;
    if (userContactInfos === null) throw new Error("No user contact infos found");

    const {data: userPersonalUPermissionGroups, error: error4} = await this.supabaseService.supabaseClient
      .from('UserPersonalUPermissionGroups')
      .select('*')
      .in('personal_u_group_id', pupgIds);

    if (error4) throw error4;
    if (userPersonalUPermissionGroups === null) throw new Error("No user personal permission groups found");

    const {data: rolePersonalUPermissionsGroups, error: error5} = await this.supabaseService.supabaseClient
      .from('RolePersonalUPermissionsGroups')
      .select('*')
      .in('personal_u_permissions_group_id', pupgIds);

    if (error5) throw error5;
    if (rolePersonalUPermissionsGroups === null) throw new Error("No role personal permission groups found");

    const {data: personalUGroupsContactInfoPermissions, error: error6} = await this.supabaseService.supabaseClient
      .from('PersonalUGroupsContactInfoPermissions')
      .select('*')
      .in('personal_u_group_id', pupgIds);

    if (error6) throw error6;
    if (personalUGroupsContactInfoPermissions === null) throw new Error("No personal groups contact info permissions found");

    // Create maps for roles and users
    const roles = new Map<string, Tables<"Roles">>();
    const users = new Map<string, Tables<"Users">>();
    const roleIds = new Set(rolePersonalUPermissionsGroups.map(rpupg => rpupg.role_id));
    const userIds = new Set(userPersonalUPermissionGroups.map(upg => upg.user_id));
    const {data: rolesData, error: error7} = await this.supabaseService.supabaseClient
      .from('Roles')
      .select('*')
      .in('id', Array.from(roleIds));
    if (error7) throw error7;

    const {data: usersData, error: error8} = await this.supabaseService.supabaseClient
      .from('Users')
      .select('*')
      .in('id', Array.from(userIds));
    if (error8) throw error8;

    // Join the data together
    const sharings = personalupermissiongroups.map(pupg => {
      const group = pupg;
      const users = userPersonalUPermissionGroups.filter(upg => upg.personal_u_permission_group_id === pupg.id);
      const roles = rolePersonalUPermissionsGroups.filter(rpupg => rpupg.personal_u_permission_group_id === pupg.id);
      const permissions = personalUGroupsContactInfoPermissions.filter(pupgp => pupgp.personal_u_permission_group_id === pupg.id);
      return {group, users, roles, permissions};
    });
    return {
      user: user,
      roles: new Map(rolesData?.map(role => [role.id, role]) || []),
      users: new Map(usersData?.map(user => [user.id, user]) || []),
      userContactInfos: new Map(userContactInfos?.map(info => [info.id, info]) || []),
      sharings: sharings
    }
  }
}
