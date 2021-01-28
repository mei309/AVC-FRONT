import { HttpErrorResponse, HttpHandler, HttpInterceptor, HttpRequest, HttpEvent, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError, timer } from 'rxjs';
import { catchError, finalize, mergeMap, retryWhen, switchMap, tap } from 'rxjs/operators';
import { AuthenticateService } from './authenticate.service';
import { LoadingService } from './loading-service.service';
@Injectable({ providedIn: 'root' })
export class HttpInterceptorService implements HttpInterceptor {
  private totalRequests = 0;

    constructor(private authenticateService: AuthenticateService, private loadingService: LoadingService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler) {
        if (this.authenticateService.isLoggedIn) {
            req = req.clone({
                setHeaders: {
                    Authorization: this.authenticateService.currentTokenValue
                }
            })
        } else if(req.url.includes('authenticate')) {
        } else {
          return this.authenticateService.waitInit().pipe(
            switchMap((res: Response) => {
              req = req.clone({
                setHeaders: {
                    Authorization: this.authenticateService.currentTokenValue
                }
              });
              return this.handleIntercept(req, next);
            })
          );
        }
        
        return this.handleIntercept(req, next);
    }

    handleIntercept(req: HttpRequest<any>, next: HttpHandler) {
      var timer;
      if(req.method !== 'GET') {
        this.totalRequests++;
        timer = setTimeout(() => this.loadingService.visibility.next(true), 1000);
      }
      const startTimestamp2 = new Date().getTime();
      return next.handle(req).pipe(
        tap((event: HttpEvent<any>) => {
          if (event instanceof HttpResponse) {
              const endTimestamp: number = new Date().getTime();
              console.log(endTimestamp - startTimestamp2+'    '+ event.url);
          }
          return event;
        }),
        retryWhen(genericRetryStrategy({
            scalingDuration: 500,
            excludedStatusCodes: [400]
        })),
        catchError((error: HttpErrorResponse) => {
              if(error.status === 401){
                return this.handle401Error(req, next);
              }
              
              let errorMessage = '';
              if (error.error instanceof ErrorEvent) {
                  // client-side error
                  errorMessage = `Error: ${error.error.message}`;
              } else {
                  // server-side error
                  errorMessage = `Error Code: ${error.status}\nMessage: ${error.error}`;
              }
              console.log(error);
              
              window.alert(errorMessage);
              return throwError(errorMessage);
        }),
        finalize(() => {
          if(req.method !== 'GET') {
            this.totalRequests--;
            if(timer){
              clearTimeout(timer);
            }
            if (this.totalRequests === 0) {
              this.loadingService.visibility.next(false);
            }
          } 
        })
      )
    }

    handle401Error(req: HttpRequest<any>, next: HttpHandler) {
        if(req.url.includes('authenticate')) {
          this.authenticateService.logOut();
          window.alert('Incorrect username or password you are redirected to login');
          return throwError('');
        }
        return this.authenticateService.refreshToken().pipe(
          switchMap((res: Response) => {
            req = req.clone({
              setHeaders: {
                  Authorization: this.authenticateService.currentTokenValue
              }
            });
            return this.handleIntercept(req, next);
          })
        );
    }
}

export const genericRetryStrategy = ({
  maxRetryAttempts = 3,
  scalingDuration = 1000,
  excludedStatusCodes = []
}: {
  maxRetryAttempts?: number,
  scalingDuration?: number,
  excludedStatusCodes?: number[]
} = {}) => (attempts: Observable<any>) => {
  return attempts.pipe(
    mergeMap((error, i) => {
      const retryAttempt = i + 1;
      // if maximum number of retries have been met
      // or response is a status code we don't wish to retry, throw error
      if (
        retryAttempt > maxRetryAttempts ||
        excludedStatusCodes.find(e => error.status >= e && error.status <= e+100)
      ) {
        return throwError(error);
      }
      console.log(
        `Attempt ${retryAttempt}: retrying in ${retryAttempt *
          scalingDuration}ms`
      );
      // retry after 1s, 2s, etc...
      return timer(retryAttempt * scalingDuration);
    }),
    finalize(() => console.log('We are done!'))
  );
};

