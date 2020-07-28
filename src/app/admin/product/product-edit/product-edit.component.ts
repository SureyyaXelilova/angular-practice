import { ProductService } from './../../../shared/services/product.service';
import { Product } from './../../../shared/interfaces';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { switchMap } from 'rxjs/operators';
import { Params, ActivatedRoute } from '@angular/router';
import { ImageService } from '../../shared/services/image.service';
import { LoadingService } from '../../shared/services/loading.service';
import { AlertService } from '../../../shared/services/alert.service';

@Component({
  selector: 'app-product-edit',
  templateUrl: './product-edit.component.html',
  styleUrls: ['./product-edit.component.css']
})
export class ProductEditComponent implements OnInit, OnDestroy {

  form: FormGroup
  product: Product
  submitted: boolean = false
  uSub: Subscription
  fSub: Subscription 
  urlSub: Subscription
  selectedFile: File | null = null
  imgSrc: any = this.imageService.previewUrl

  constructor(
    private route: ActivatedRoute, 
    private productService: ProductService,  
    private imageService: ImageService,
    private alert: AlertService,
    private loadingService: LoadingService
  ) {}

  ngOnInit(): void {
    this.getById()
    this.valueFormGroup(null)
  }
  
  getById(){
    this.route.params.pipe(
      switchMap((params: Params) => {
        return this.productService.getById(params['id'])
      })
    ).subscribe((product: Product) => {
      this.product = product
      this.valueFormGroup(product)
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

    this.product.name = this.form.value.name
    this.product.brandName = this.form.value.brandName
    this.product.price = this.form.value.price
    this.product.description = this.form.value.description

    if(this.selectedFile == null){
      this.uSub = this.productService.update(this.product).subscribe(
        () => this.submitResult(true),
        () => this.submitResult(false),
      )
    }else{
      this.fSub = this.imageService.imageAddToFirebase('products', this.selectedFile).subscribe(
        null,
        () => this.submitResult(false),
        () => this.urlSub = this.imageService.getDownloadURL().subscribe(
          imageUrl => {
            this.product.imageUrl = imageUrl 
            this.uSub = this.productService.update(this.product).subscribe(
              () => this.submitResult(true),
              () => this.submitResult(false)
            )
          } 
        )
      )
    }
  }

  valueFormGroup(product: Product | null){
    this.imgSrc = product == null ? this.imageService.previewUrl : product.imageUrl
    this.form = new FormGroup({
      name: new FormControl(product == null ? null : product.name, [Validators.required]),
      brandName: new FormControl(product == null ? null : product.brandName, [Validators.required]),
      price: new FormControl(product == null ? null : product.price, [Validators.required]),
      description: new FormControl(product == null ? null : product.description, [Validators.required]),
      imageUrl: new FormControl(''),
    })
  }

  submitResult(result){
    result === true ? this.alert.success('Product is updated') : this.alert.danger('Product is not updated')
    this.submitted = false
    this.loadingService.unvisible()
  }

  ngOnDestroy(): void{
    if(this.uSub){
      this.uSub.unsubscribe()
    }
    if(this.fSub){
      this.fSub.unsubscribe()
    }
    if(this.urlSub){
      this.urlSub.unsubscribe()
    }
  }
}

