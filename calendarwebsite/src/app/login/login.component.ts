import {Component, inject, signal} from '@angular/core';
import {MatError, MatFormField, MatInput, MatLabel} from '@angular/material/input';
import {FormControl, ReactiveFormsModule, Validators} from '@angular/forms';
import {merge} from 'rxjs';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {SupabaseService} from '../../core/services/SupabaseService';
import {MatButton} from '@angular/material/button';

@Component({
  selector: 'app-login',
  imports: [
    MatFormField,
    MatLabel,
    MatInput,
    MatError,
    ReactiveFormsModule,
    MatButton
  ],
  providers: [SupabaseService],
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
    console.log("Logging in...");
    const email = this.email.value;
    const password = this.password.value;
    console.log("Email:", email);
    if (email == null || email == "" || password == null || password == "") {
      this.errorMessage.set('Please fill in all fields');
      return;
    }
    if (this.email.hasError('required') || this.email.hasError('email')) {
      this.errorMessage.set('Please enter a valid email');
      return;
    }
    console.log("Inje:", email);
    console.log("Logging in with email:", email);
    this.supabase.signInWithEmail({
      email: email,
      password: password,
    })
  }
}
