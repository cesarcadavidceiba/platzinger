import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';

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

  constructor(private authenticationService: AuthenticationService) { }

  ngOnInit() {
    this.getCurrentUser();
  }

  login() {
    this.authenticationService.loginWithEmail(this.email, this.password).then((data) => {
      console.log('Logueado Correctamente!');
      console.log(data);
    }).catch( (error) => {
      alert('Ocurrio un error');
      console.log(error);
    });
  }

  onLoginFacebook(){
    this.authenticationService.loginWithFacebook();
  }

  getCurrentUser(){
    this.authenticationService.isAuth().subscribe( auth => {
      if(auth){
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
      console.log('Registrado Correctamente!');
      console.log(data);
    }).catch( (error) => {
      alert('Ocurrio un error');
      console.log(error);
    });
  }

}
