import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  operation: string = 'login';
  email: string = null;
  password: string = null;
  isLoggedFacebook = false;
  nick: string = null;

  constructor(private authenticationService: AuthenticationService, private userService: UserService,
    private router : Router
    ) { }

  ngOnInit() {
    this.getCurrentUser();
  }

  login() {
    this.authenticationService.loginWithEmail(this.email, this.password).then((data) => {
      console.log('Logueado Correctamente!');
      console.log(data);
      this.router.navigate(['home']);
    }).catch((error) => {
      alert('Ocurrio un error');
      console.log(error);
    });
  }

  onLoginFacebook() {
    this.authenticationService.loginWithFacebook();
  }

  getCurrentUser() {
    this.authenticationService.isAuth().subscribe(auth => {
      if (auth) {
        console.log('User Logueado');
        this.isLoggedFacebook = true;
      } else {
        console.log('NOT User Logueado');
        this.isLoggedFacebook = false;
      }
    });
  }

  register() {
    this.authenticationService.registerWithEmail(this.email, this.password).then((data) => {
      const user = {
        uid: data.user.uid,
        email: this.email,
        nick: this.nick
      };
      this.userService.createUSer(user).then((registro) => {
        console.log('Registrado Correctamente!');
        console.log(registro);
      }).catch((error) => {
        alert('Ocurrio un error');
        console.log(error);
      });
    }).catch((error) => {
      alert('Ocurrio un error: ' + error);
      console.log(error);
    });
  }

}
