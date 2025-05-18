import {Component, inject, signal} from '@angular/core';
import {MatListOption, MatSelectionList} from '@angular/material/list';
import {Tables} from '../../supabase_generated/database.types';
import {ContactsService} from '../core/services/contacts.service';

@Component({
  selector: 'app-contacts',
  imports: [
    MatSelectionList,
    MatListOption
  ],
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.less'
})
export class ContactsComponent {
  users = signal<Tables<"Users">[] | null>(null)
  selectedUser = signal<Tables<"Users"> | null>(null);
  selectedUserInfos = signal<Tables<"UserContactInfos">[] | null>(null);
  contactsService = inject(ContactsService)

  constructor() {
    this.contactsService.getContacts().then(contacts => {
      console.log("Fetched contacts:", contacts);
      this.users.set(contacts);
    })
  }

  onUserSelected(user: Tables<"Users">) {
    this.selectedUser.set(user);
    this.selectedUserInfos.set(null)
    this.contactsService.getContactInfosOfUser(user.id).then(infos => {
      this.selectedUserInfos.set(infos)
    })
  }

  protected readonly Date = Date;
}
