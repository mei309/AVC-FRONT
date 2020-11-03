import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';


@Injectable()
export class LoadingService {
   public visibility: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
}