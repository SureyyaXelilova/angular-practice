import { Injectable } from "@angular/core";
import { TranslateService } from '@ngx-translate/core';

@Injectable()
export class LanguageService {
    
    currentLang: string 

    constructor(private translateService: TranslateService){
        this.currentLang = localStorage.getItem('language')
        if(this.currentLang == null){
            localStorage.setItem('language', 'az')
            this.currentLang = 'az'
        }
        this.translateService.setDefaultLang(this.currentLang);
    }

    setLanguage(languageCode: string) {
        localStorage.setItem('language', languageCode)
        this.translateService.use(languageCode);
        this.currentLang = this.translateService.currentLang
    }

    allLanguages(){
        return [
            {
                lang: 'az',
                active: this.currentLang === 'az' ? true : false
            },
            {
                lang: 'ru',
                active: this.currentLang === 'ru' ? true : false
            },
            {
                lang: 'en',
                active: this.currentLang === 'en' ? true : false
            },
        ]
    }
}