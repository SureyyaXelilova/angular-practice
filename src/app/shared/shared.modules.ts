
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { NgModule } from "@angular/core";
import { QuillModule } from 'ngx-quill'
import { SearchBlogPostsPipe } from './pipes/search-blog-posts.pipe';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SearchNewsPostsPipe } from './pipes/search-news-posts.pipe';
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { SearchContact } from './pipes/search-contact.pipe';
import { SearchProductsPipe } from './pipes/search-products.pipe';
import { AlertComponent } from './components/alert/alert.component';

export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http);
}

@NgModule({
    declarations: [
        SearchBlogPostsPipe,
        SearchNewsPostsPipe,
        SearchContact,
        SearchProductsPipe,
        AlertComponent
    ],
    imports: [
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        QuillModule.forRoot(),
        TranslateModule.forRoot({
            loader: {
              provide: TranslateLoader,
              useFactory: HttpLoaderFactory,
              deps: [HttpClient]
            }
        })
    ],
    exports: [
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        QuillModule,
        SearchBlogPostsPipe,
        SearchNewsPostsPipe,
        SearchContact,
        SearchProductsPipe,
        TranslateModule,
        AlertComponent
    ],
    
})
export class SharedModule {}