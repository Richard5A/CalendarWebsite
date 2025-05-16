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
  contactsService = inject(ContactsService)

  constructor() {
    this.contactsService.getContacts().then(contacts => {
      console.log("Fetched contacts:", contacts);
      this.users.set(contacts);
    })
  }

}
