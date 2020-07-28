import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable()
export class LoadingService{
    public loading$ = new Subject<boolean>()

    visible() {
        this.loading$.next(true)
    }
    
    unvisible() {
        this.loading$.next(false)
    }
}