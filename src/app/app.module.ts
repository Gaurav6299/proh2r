import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MatDialogModule, MatButtonModule, MatProgressBarModule, MatProgressSpinnerModule, MatTooltipModule } from '@angular/material';
import { HttpModule, RequestOptions, XHRBackend } from '@angular/http';
import { ApiCommonService } from './services/api-common.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { UploadFileService } from '../app/services/UploadFileService.service';
import { ValidationMessagesService } from './validation-messages.service';
import { DatePipe } from '@angular/common';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgxSpinnerService } from 'ngx-spinner';
import { LoaderInterceptorService, SpinnerService } from './services/spinner.service';
import { ErrorHandlerInterceptor } from './services/errorhandler.interceptor';
import { MatSidenavModule } from '@angular/material/sidenav';
import { AgmCoreModule } from '@agm/core';
import { AccessModuleGuard } from './services/access-permission.guard';
import { AccessDeniedComponent } from './access-denied/access-denied.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { ModuleService } from './services/module.service';

export function moduleServiceInitializer(moduleService: ModuleService) {
  return () => moduleService.ngOnInit();
}

@NgModule({
  declarations: [
    AppComponent,
    AccessDeniedComponent,
    PageNotFoundComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatDialogModule,
    MatButtonModule,
    MatSidenavModule,
    HttpModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    NgxSpinnerModule,
    MatTooltipModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyBxd-Rce45qk0zl-Q4128bKpaNGXoZMTy8',
      libraries: ['places']
    })
  ],
  entryComponents: [

  ],
  providers: [
    { provide: APP_INITIALIZER, deps: [ModuleService], useFactory: moduleServiceInitializer, multi: true },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoaderInterceptorService,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorHandlerInterceptor,
      multi: true
    },
    ApiCommonService,
    UploadFileService,
    ValidationMessagesService,
    DatePipe,
    NgxSpinnerService,
    SpinnerService,
    AccessModuleGuard
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
