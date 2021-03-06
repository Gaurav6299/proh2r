import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { KeycloakService } from './app/keycloak/keycloak.service';
import 'hammerjs';

if (environment.production) {
  enableProdMode();
}

KeycloakService.init()
.then(() => platformBrowserDynamic().bootstrapModule(AppModule));
