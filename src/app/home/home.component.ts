import { Component, OnInit } from '@angular/core';
import { User } from '../interfaces/user';
import { UserService } from '../services/user.service';
import { AuthenticationService } from '../services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  friends: User[];
  query: string = '';

  constructor(private userServices: UserService, 
    private authenticationService: AuthenticationService,
    private router: Router) {
    this.userServices.getUsers().valueChanges().subscribe(
      (data: User[]) => {
        this.friends = data;
      }, 
    (error) => {
      console.log(error);
    });
  }

  ngOnInit() {
  }

  logout() {
    this.authenticationService.logOut().then(() => {
      alert('Sesion cerrada');
      this.router.navigate(['login']);
    }).catch((error) => {
      console.log(error)
    });
  }

}
