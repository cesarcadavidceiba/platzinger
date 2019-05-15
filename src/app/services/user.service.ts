import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private angularFireDatabase: AngularFireDatabase) {
  }

  getUsers() {
    return this.angularFireDatabase.list('/users');
  }

  getUserById(uid: string) {
    return this.angularFireDatabase.object('/users/' + uid);
  }

  createUSer(user) {
    return this.angularFireDatabase.object('/users/' + user.uid).set(user);
  }

  editUSer(user) {
    return this.angularFireDatabase.object('/users/' + user.uid).set(user);
  }

  setAvatar(avatar, uid) {
    return this.angularFireDatabase.object('/users/' + uid + '/avatar').set(avatar);
  }

  addFriend(userUid, friendUid) {
    this.angularFireDatabase.object('/users/' + userUid + '/friends/' + friendUid).set(friendUid);
    return this.angularFireDatabase.object('/users/' + friendUid + '/friends/' + userUid).set(userUid);
  }


}
