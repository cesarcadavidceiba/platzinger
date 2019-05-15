import { Component, OnInit } from '@angular/core';
import { DialogService, DialogComponent } from 'ng2-bootstrap-modal';
import { UserService } from 'src/app/services/user.service';
import { RequestsService } from 'src/app/services/requests.service';
import { User } from 'src/app/interfaces/user';

export interface PromptModel {
  scope: any;
  currentRequest: any;
  userRequestFriendship: User;
}

@Component({
  selector: 'app-request',
  templateUrl: './request.component.html',
  styleUrls: ['./request.component.css']
})
export class RequestComponent extends DialogComponent<PromptModel, any> implements PromptModel {

  scope: any;
  currentRequest: any;
  userRequestFriendship: User;
  shouldAdd = 'yes';

  constructor(
    dialogService: DialogService,
    private userServices: UserService,
    private requestsServices: RequestsService) {
    super(dialogService);
  }

  accept() {
    if (this.shouldAdd === 'yes') {
      this.requestsServices.setRequestStatus(this.currentRequest, 'accepted').then((data) => {
        this.userServices.addFriend(this.scope.user.uid, this.currentRequest.sender).then(() => {
          alert('Solicitud aceptada con exito');
          this.dialogService.removeDialog(this);
        });
      }).catch((error) => {
        alert('Ocurrio un error en el servicio de peticiones');
        console.log(error);
      });
    } else if (this.shouldAdd === 'no') {
      this.requestsServices.setRequestStatus(this.currentRequest, 'rejected').then((data) => {
        console.log(data);
      }).catch((error) => {
        alert('Ocurrio un error en el servicio de peticiones');
        console.log(error);
      });
    } else if (this.shouldAdd === 'later') {
      this.requestsServices.setRequestStatus(this.currentRequest, 'decide_later').then((data) => {
        console.log(data);
      }).catch((error) => {
        alert('Ocurrio un error en el servicio de peticiones');
        console.log(error);
      });
    }

  }

}
