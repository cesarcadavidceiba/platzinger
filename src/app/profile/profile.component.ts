import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { AuthenticationService } from '../services/authentication.service';
import { User } from '../interfaces/user';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { AngularFireStorage } from '@angular/fire/storage';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  user: User;

  imageChangedEvent: any = '';
  croppedImage: any = '';
  picture: any;

  constructor(
    private userService: UserService, 
    private authenticationService: AuthenticationService,
    private firebaseStore: AngularFireStorage) {
    this.authenticationService.getStatus().subscribe(
      (status) => {
        this.userService.getUserById(status.uid).valueChanges().subscribe(
          (user: User) => {
            console.log(user);
            this.user = user;
          },
          (error) => {
            console.log(error);
          });
      },
      (error) => {
        console.log(error);
      });
  }

  ngOnInit() {
  }

  saveSetting() {

    if (this.croppedImage) {
      const currentPictureId = Date.now();
      const pictures = this.firebaseStore.ref('pictures/' + currentPictureId + '.jpg').putString(this.croppedImage, 'data_url');
      pictures.then(() => {
        this.picture = this.firebaseStore.ref('pictures/' + currentPictureId + '.jpg').getDownloadURL();

        this.picture.subscribe((url) => {
          this.userService.setAvatar(url, this.user.uid).then(() => {
            alert('Avatar cargado correctamente!')
          }).catch((error) => {
            alert('Hubo un error al subir el avatar');
            console.log(error);
          });
        });
      }).catch((error) => {
        console.log(error)
      })
    } else {
      this.userService.editUSer(this.user).then(
        () => {
          alert('Información Actualizada!')
        },
        (error) => {
          alert('Error actualizando la información')
          console.log(error);
        });
    }
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
