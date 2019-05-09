import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from '../interfaces/user';
import { UserService } from '../services/user.service';
import { ConversationService } from '../services/conversation.service';
import { AuthenticationService } from '../services/authentication.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { AngularFireStorage } from '@angular/fire/storage';

@Component({
  selector: 'app-conversation',
  templateUrl: './conversation.component.html',
  styleUrls: ['./conversation.component.css']
})
export class ConversationComponent implements OnInit {

  private friendId: any;
  private friend: User;
  private user: User;
  private conversationId: string;
  private textMessage: string;
  private conversation: any[];
  private shake = false;
  private closeResult: string;
  private imageChangedEvent: any = '';
  private croppedImage: any = '';
  private picture: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    private userService: UserService,
    private conversationService: ConversationService,
    private authenticationService: AuthenticationService,
    private modalService: NgbModal,
    private firebaseStore: AngularFireStorage) {
    const uid = 'uid';
    this.friendId = this.activatedRoute.snapshot.params[uid];
    this.authenticationService.getStatus().subscribe((sesion) => {
      this.userService.getUserById(sesion.uid).valueChanges().subscribe((user: User) => {
        this.user = user;
        this.userService.getUserById(this.friendId).valueChanges().subscribe(
          (data: User) => {
            this.friend = data;
            const ids = [this.user.uid, this.friend.uid].sort();
            this.conversationId = ids.join('|');
            this.getConversation();
          },
          (error) => {
            console.log(error);
          });
      }
      );
    });

  }

  ngOnInit() {
  }

  sendMessage() {
    const message = {
      uid: this.conversationId,
      timestamp: Date.now(),
      text: this.textMessage,
      sender: this.user.uid,
      receiver: this.friend.uid,
      type: 'text'
    };

    this.conversationService.createConversation(message).then(() => {
      this.textMessage = '';
    });
  }

  sendZumbido() {
    const message = {
      uid: this.conversationId,
      timestamp: Date.now(),
      text: 'zumbido!',
      sender: this.user.uid,
      receiver: this.friend.uid,
      type: 'zumbido'
    };

    this.conversationService.createConversation(message).then(() => { });
    this.doZumbido();
  }

  doZumbido() {
    const zumbido = new Audio('assets/sound/zumbido.m4a');
    zumbido.play();
    this.shake = true;
    window.setTimeout(() => {
      this.shake = false;
    }, 1000);
  }

  getConversation() {
    this.conversationService.getConversation(this.conversationId).valueChanges().subscribe((data) => {
      this.conversation = data;
      this.conversation.forEach((message) => {
        if (!message.seen) {
          message.seen = true;
          this.conversationService.editConversation(message);

          switch (message.type) {
            case 'text': {
              const audio = new Audio('assets/sound/new_message.m4a');
              audio.play();
              break;
            }
            case 'zumbido': {
              this.doZumbido();
              break;
            }
            case 'image': {
              const audio = new Audio('assets/sound/new_message.m4a');
              audio.play();
              break;
            }
          }
        }
      });
    },
      (error) => {
        console.log(error);
      }
    );
  }

  getUserNickById(id) {
    if (id === this.friend.uid) {
      return this.friend.nick;
    } else {
      return this.user.nick;
    }
  }

  open(content) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  saveImageMenssage() {
    if (this.croppedImage) {
      const idImage = Date.now();
      const savePicture = this.firebaseStore.ref('/picturesConversation/' + idImage + '.jpg').putString(this.croppedImage, 'data_url');
      savePicture.then(() => {
        const urlPicture = this.firebaseStore.ref('/picturesConversation/' + idImage + '.jpg').getDownloadURL();
        urlPicture.subscribe((url) => {
          this.sendImageConversation(url);
        });
      });
    }
  }

  sendImageConversation(url: string) {
    const message = {
      uid: this.conversationId,
      timestamp: Date.now(),
      text: url,
      sender: this.user.uid,
      receiver: this.friend.uid,
      type: 'image'
    };

    this.conversationService.createConversation(message).then(() => {
      this.croppedImage = null;
    });
  }

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
  }
  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
  }
  imageLoaded() {
    // show cropper
  }
  cropperReady() {
    // cropper ready
  }
  loadImageFailed() {
    // show message
  }

}
