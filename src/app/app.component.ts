import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from './services/authentication.service';
import { UserService } from './services/user.service';
import { User } from './interfaces/user';
import { RequestsService } from './services/requests.service';
import { DialogService } from 'ng2-bootstrap-modal';
import { RequestComponent } from './modals/request/request.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  title = 'platzinger';
  user: User;
  requests: any[] = [];
  mailsShown: any[] = [];

  constructor(
    public router: Router,
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private requestsServices: RequestsService,
    private dialogService: DialogService
  ) {
    this.authenticationService.getStatus().subscribe((status) => {
      this.userService.getUserById(status.uid).valueChanges().subscribe((data: User) => {
        this.user = data;
        this.requestsServices.getRequestsForEmail(this.user.email).valueChanges().subscribe((requests) => {
          this.requests = requests;
          this.requests = this.requests.filter((request) => {
            return request.status !== 'accepted' && request.status !== 'rejected';
          });

          this.requests.forEach((request) => {
            if (this.mailsShown.indexOf(request.sender) === -1) {
              this.mailsShown.push(request.sender);
              this.userService.getUserById(request.sender).valueChanges().subscribe((userSender: User) => {
                this.dialogService.addDialog(RequestComponent,
                  { scope: this, currentRequest: request, userRequestFriendship: userSender });
              });
            }
          });

        }, (error) => {
          console.log(error);
        });
      });
    });
  }

}
