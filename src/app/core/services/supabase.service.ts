import {Injectable, NgZone} from '@angular/core';
import {
  AuthChangeEvent, AuthError,
  createClient,
  Session,
  SignInWithPasswordCredentials,
  SupabaseClient,
  User
} from '@supabase/supabase-js';
import {BehaviorSubject} from 'rxjs';
import {Router} from '@angular/router';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: "root"
})
export class SupabaseService {
  private supabase: SupabaseClient
  private currentUserSubject = new BehaviorSubject<User | null>(null);

  constructor(private router: Router, private ngZone: NgZone) {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseAnonKey);

    this.supabase.auth.getSession().then(({ data }) => {
      this.currentUserSubject.next(data.session?.user ?? null);
    });

    // Listen to auth changes
    this.supabase.auth.onAuthStateChange((event: AuthChangeEvent, session: Session | null) => {
      // Run inside Angular zone to ensure UI updates correctly
      this.ngZone.run(() => {
        const user = session?.user ?? null;
        this.currentUserSubject.next(user);
        console.log(`Supabase auth state changed: ${event}`, session);

        // if (event === 'SIGNED_OUT') this.router.navigate(['/login']);
      });
    });
  }

  get supabaseClient(): SupabaseClient {
    return this.supabase;
  }

  get userId(): string | undefined {
    return this.currentUserSubject.value?.id
  }

  async signInWithEmail(credentials: SignInWithPasswordCredentials): Promise<AuthError | null> {
    console.log("Logging in with email:", credentials);
    const { error } = await this.supabase.auth.signInWithPassword(credentials);
    return error;
  }

  async signOut(): Promise<AuthError | null> {
    const { error } = await this.supabase.auth.signOut();
    return error;
  }
}
