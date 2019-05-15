import { Component, OnInit } from '@angular/core';
import { User } from '../interfaces/user';
import { UserService } from '../services/user.service';
import { AuthenticationService } from '../services/authentication.service';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RequestsService } from '../services/requests.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  friends: User[];
  query = '';
  friendEmail: string;
  greetingRequest: string;
  user: User;

  constructor(
    private userServices: UserService,
    private authenticationService: AuthenticationService,
    private router: Router,
    private modalService: NgbModal,
    private requestsService: RequestsService) {
    this.userServices.getUsers().valueChanges().subscribe(
      (data: User[]) => {
        this.friends = data;
      },
      (error) => {
        console.log(error);
      });

    this.authenticationService.getStatus().subscribe((status) => {
      this.userServices.getUserById(status.uid).valueChanges().subscribe((user: User) => {
        this.user = user;
        if (this.user.friends) {
          this.user.friends = Object.values(this.user.friends);
        }
      });
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

  open(content) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
    }, (reason) => {
    });
  }

  sendRequest() {
    const request = {
      timestamp: Date.now(),
      receiver_email: this.friendEmail,
      sender: this.user.uid,
      status: 'pending',
      greeting: this.greetingRequest
    };

    this.requestsService.createRequest(request).then(() => {
      alert('Solicitud Enviada');
    }).catch((error) => {
      alert('Hubo un Error');
      console.log(error);
    });
  }

}
