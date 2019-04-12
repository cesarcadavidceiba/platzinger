import { Injectable } from '@angular/core';
import { User } from '../interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  
  private friends: User[]
  constructor() {
    let usuario1: User = {
      nick: 'Eduardo',
      subNick: '',
      age: 24,
      email: 'ed@aoe.aoe',
      friend: true,
      uid: 2,
      status: 'online'
    };
    
    let usuario2: User = {
      nick: 'Freddy',
      subNick: '',
      age: 28,
      email: 'fred@aoe.aoe',
      friend: true,
      uid: 3,
      status: 'offline'
    };
    let usuario3: User = {
      nick: 'Yuliana',
      subNick: '',
      age: 18,
      email: 'yuli@aoe.aoe',
      friend: true,
      uid: 4,
      status: 'busy'
    };
    let usuario4: User = {
      nick: 'Ricardo',
      subNick: '',
      age: 17,
      email: 'rick@aoe.aoe',
      friend: false,
      uid: 5,
      status: 'away'
    };
    let usuario5: User = {
      nick: 'Marcos',
      subNick: '',
      age: 30,
      email:'marcos@aoe.aoe',
      friend: false,
      uid: 1,
      status: 'online'
    };

    this.friends = [usuario1, usuario2, usuario3, usuario4, usuario5]
   }
  
   getFriends() {
      return this.friends; 
   }

}
