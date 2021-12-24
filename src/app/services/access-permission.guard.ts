import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanLoad, Route, NavigationEnd, CanActivateChild } from '@angular/router';
import { KeycloakService } from '../keycloak/keycloak.service';
import { ApiCommonService } from './api-common.service';
import { ModuleService } from './module.service';
/**
 * Level 1 guard for modules using lazy loading
 * implements CanLoad
 */
@Injectable({
  providedIn: 'root'
})
export class AccessModuleGuard implements CanLoad {
  accessibleModules: any = [];
  constructor(private router: Router) {
  }

  /**
   * to decide if module can be loaded
   */
  canLoad(route: Route): boolean {
    var rolesArr = KeycloakService.getUserRole();
    this.accessibleModules = ModuleService.accessibleModules;

    if (this.accessibleModules.includes(route.data.module)) {
      if (route.data.role.length>0 && rolesArr.find(role => role == route.data.role[0] || role == route.data.role[1])) {
        console.log("access granted");
        return true;
      }
      else if (!(route.data.role.length>0)) return true;
    }
    console.log("access denied");
    this.router.navigate(['/access-denied']);
    return false;
  }
}

/**
 * Level 2 guard for components having direct path in module routing
 * implements CanActivate
 */
@Injectable({
  providedIn: 'root'
})
export class AccessComponentGuard implements CanActivate {
  constructor(private router: Router) { }
  /**
   * to decide if component route can be activated
   * @param route ActivatedRouteSnapshot
   * @param state RouterStateSnapshot
   * @returns boolean
   */
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    var rolesArr = KeycloakService.getUserRole();
    if (rolesArr.find(role => role == route.data.role)) {
      console.log("access granted");
      return true;
    }
    console.log("access denied");
    this.router.navigate(['/access-denied']);
    return false;
  }
}

/**
 * Level 3 guard for components having child path in module routing
 * implements CanActivateChild
 */
@Injectable({
  providedIn: 'root'
})
export class AccessChildGuard implements CanActivateChild {
  constructor(private router: Router) { }
  /**
   * to decide if child route can be activated
   * @param route ActivatedRouteSnapshot
   * @param state RouterStateSnapshot
   * @returns boolean
   */
  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    var rolesArr = KeycloakService.getUserRole();
    if (rolesArr.find(role => role == route.data.role)) {
      console.log("access granted");
      return true;
    }
    console.log("access denied");
    this.router.navigate(['/access-denied']);
    return false;
  }
}