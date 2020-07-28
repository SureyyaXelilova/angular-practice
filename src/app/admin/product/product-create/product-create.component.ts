import { ProductService } from './../../../shared/services/product.service';
import { LoadingService } from './../../shared/services/loading.service';
import { ImageService } from './../../shared/services/image.service';
import { Product } from './../../../shared/interfaces';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AlertService } from '../../../shared/services/alert.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-product-create',
  templateUrl: './product-create.component.html',
  styleUrls: ['./product-create.component.css']
})
export class ProductCreateComponent implements OnInit, OnDestroy {

  form: FormGroup 
  selectedFile: File = null
  imgSrc: any = this.imageService.previewUrl
  submitted: boolean = false
  cSub: Subscription
  fSub: Subscription
  uSub: Subscription

  constructor(
    private imageService: ImageService, 
    private productService: ProductService,
    private alert: AlertService,
    private loadingService: LoadingService
  ) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl(null, [Validators.required]),
      brandName: new FormControl(null, [Validators.required]),
      price: new FormControl(null, [Validators.required]),
      description: new FormControl(null, [Validators.required]),
      imageUrl: new FormControl('', [Validators.required]),
    })
  }
  
  onFileSelect(event){
    this.selectedFile = event.target.files[0]
    this.imageService.showPreview(event).then(imgSrc => this.imgSrc = imgSrc)
  }

  submit(){
    if(this.form.invalid){
      return
    }
    this.submitted = true
    this.loadingService.visible()
    let product: Product = {
      name: this.form.value.name,
      brandName: this.form.value.brandName,
      price: this.form.value.price,
      description: this.form.value.description,
      imageUrl:'',
      date: new Date()
    }
    this.fSub = this.imageService.imageAddToFirebase('products', this.selectedFile).subscribe(
      null,
      () => this.submitResult(false),
      () => this.uSub = this.imageService.getDownloadURL().subscribe(
        imageUrl => {
          product.imageUrl = imageUrl 
          this.cSub = this.productService.create(product).subscribe(
            () => {
              this.form.reset()
              this.imgSrc = this.imageService.previewUrl
              this.submitResult(true)
            }, 
            () => this.submitResult(false)
          )
        } 
      )
    )
  }

  submitResult(result){
    result === true ? this.alert.success('Product is created') : this.alert.danger('Product is not created')
    this.submitted = false
    this.loadingService.unvisible()
  }

  ngOnDestroy():void {
    if(this.cSub){
      this.cSub.unsubscribe()
    }
    if(this.fSub){
      this.fSub.unsubscribe()
    }
    if(this.uSub){
      this.uSub.unsubscribe()
    }
  }
}
