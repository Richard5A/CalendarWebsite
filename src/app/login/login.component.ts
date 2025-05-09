import {Component, inject, signal} from '@angular/core';
import {MatError, MatFormField, MatInput, MatLabel} from '@angular/material/input';
import {FormControl, ReactiveFormsModule, Validators} from '@angular/forms';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {merge} from 'rxjs';
import {SupabaseService} from '../core/services/SupabaseService';
import {MatButton} from '@angular/material/button';

@Component({
  selector: 'app-login',
  imports: [
    MatFormField,
    MatInput,
    ReactiveFormsModule,
    MatButton,
    MatLabel,
    MatError
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.less'
})
export class LoginComponent {
  readonly email = new FormControl('', [Validators.required, Validators.email]);
  readonly password = new FormControl('', [Validators.required])
  errorMessage = signal("");
  private supabase = inject(SupabaseService)

  constructor() {
    merge(this.email.statusChanges, this.email.valueChanges)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateEmailErrorMessage());
  }

  updateEmailErrorMessage() {
    if (this.email.hasError('required')) {
      this.errorMessage.set('You must enter a value');
    } else if (this.email.hasError('email')) {
      this.errorMessage.set('Not a valid email');
    } else {
      this.errorMessage.set('');
    }
  }

  login() {
    const email = this.email.value;
    const password = this.password.value;
    if (email == null || email == "" || password == null || password == "") {
      this.errorMessage.set('Please fill in all fields');
      return;
    }
    if (this.email.hasError('required') || this.email.hasError('email')) {
      this.errorMessage.set('Please enter a valid email');
      return;
    }
    this.supabase.signInWithEmail({
      email: email,
      password: password,
    })
  }
}
