import { Component } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { BehaviorSubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Genral } from './genral.service';
import { AuthenticateService } from './service/authenticate.service';
import { LoadingService } from './service/loading-service.service';


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
})
export class MainComponent {
  navigationSubscription;
  public visibility: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  
  destroySubject$: Subject<void> = new Subject();
  
  todo: number = 0;
  massages: number = 0;

  constructor(private genral: Genral, private genralService: AuthenticateService, public loadingService: LoadingService,
    private _Activatedroute:ActivatedRoute, private router: Router) {}
  
  ngOnInit() {
    this.genral.getNumOfTodo().pipe(takeUntil(this.destroySubject$)).subscribe(value => {
      this.todo = value;
    });
    this.genral.getNumOfMassages().pipe(takeUntil(this.destroySubject$)).subscribe(val => {
      this.massages = val;
    });
    this.visibility = this.loadingService.visibility;
    // this.navigationSubscription = this.router.events.subscribe((e: any) => {
    //   // If it is a NavigationEnd event re-initalise the component
    //   if (e instanceof NavigationEnd) {
    //     var ele = (document.getElementsByTagName('input')[0] as HTMLElement).focus();
    //   }
    // });
  }

  onInitilRefresh() {
    this.genral.backToInitil();
  }

  logout() {
    this.genralService.logOut();
  }

  ngOnDestroy() {
    this.destroySubject$.next();
  }

}
