import { Injectable } from "@angular/core";
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize, map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable()
export class ImageService {
    imgSrc: any = ''
    previewUrl: string = '../../../../assets/images/preview-image1.png'
    fileRef: any = ''
    constructor(private storage: AngularFireStorage){}

    imageAddToFirebase(folderName, selectedFile): Observable<any> {
        let path = `${folderName}/${selectedFile.name}`
        this.fileRef = this.storage.ref(path)
        return this.storage.upload(path , selectedFile).snapshotChanges()
    }

    getDownloadURL(): Observable<string> {
       return this.fileRef.getDownloadURL()
    }
    
    showPreview(event){
      this.imgSrc = ''
      if (event.target.files.length === 0) {
        return null
      }
      var mimeType = event.target.files[0].type;
      if (mimeType.match(/image\/*/) == null) {
        return null;
      }
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(event.target.files[0]); 
        reader.onload = (_event) => { 
          this.imgSrc = reader.result; 
          console.log(this.imgSrc)
          resolve(this.imgSrc);
        }
      });
    }
}