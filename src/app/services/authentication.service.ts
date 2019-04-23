import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private angularFireAuth: AngularFireAuth) { }

  loginWithEmail(email: string, password: string) {
    return this.angularFireAuth.auth.signInWithEmailAndPassword(email, password);
  }

  loginWithFacebook() {
    this.angularFireAuth.auth.signInWithPopup(new auth.FacebookAuthProvider());
  }

  registerWithEmail(email: string, password: string) {
    return this.angularFireAuth.auth.createUserWithEmailAndPassword(email, password);
  }

  getStatus() {
    return this.angularFireAuth.authState;
  }

  logOut() {
    return this.angularFireAuth.auth.signOut;
  }

  isAuth() {
    return this.angularFireAuth.authState.pipe(map(auth => auth));
  }

}
