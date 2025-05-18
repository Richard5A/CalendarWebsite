import {Component, inject, signal} from '@angular/core';
import {MatListOption, MatSelectionList} from "@angular/material/list";
import {Tables} from '../../../supabase_generated/database.types';
import {ContactsService} from '../../core/services/contacts.service';

@Component({
  selector: 'app-contacts-layout',
    imports: [
        MatListOption,
        MatSelectionList
    ],
  templateUrl: './contacts-layout.component.html',
  styleUrl: './contacts-layout.component.less'
})
export class ContactsLayoutComponent {
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
    if(this.selectedUser() === user) {
      return;
    }
    this.selectedUser.set(user);
    this.selectedUserInfos.set(null)
    this.contactsService.getContactInfosOfUser(user.id).then(infos => {
      this.selectedUserInfos.set(infos)
    })
  }
}
