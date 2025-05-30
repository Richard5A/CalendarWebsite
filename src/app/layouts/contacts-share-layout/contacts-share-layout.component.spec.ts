import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactsShareLayoutComponent } from './contacts-share-layout.component';

describe('ContactsShareLayoutComponent', () => {
  let component: ContactsShareLayoutComponent;
  let fixture: ComponentFixture<ContactsShareLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactsShareLayoutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContactsShareLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
