import {Component, inject, signal} from '@angular/core';
import {ContactSharingInformation, ContactsService} from '../../core/services/contacts.service';

@Component({
  selector: 'app-contacts-share-layout',
  imports: [],
  templateUrl: './contacts-share-layout.component.html',
  styleUrl: './contacts-share-layout.component.less'
})
export class ContactsShareLayoutComponent {
  contactsService = inject(ContactsService)

  sharingInformation = signal<ContactSharingInformation | null>(null)

  constructor() {
    this.contactsService.getSharingInformationOfThisUser().then(contacts => {
      console.log("Fetched contacts:", contacts);
      this.sharingInformation.set(contacts)
    })
  }
}
