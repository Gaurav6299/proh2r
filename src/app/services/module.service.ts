import { Injectable, OnInit } from "@angular/core";
import { KeycloakService } from "../keycloak/keycloak.service";
import { ApiCommonService } from "./api-common.service";

@Injectable({
  providedIn: 'root'
})
export class ModuleService implements OnInit{
static accessibleModules: any;
    constructor(private serviceApi: ApiCommonService) {}
    ngOnInit(): Promise<void> {
        return this.serviceApi.get('/v1/employee/profile/' + KeycloakService.getUsername() + '/header').toPromise()
            .then(data => {
                ModuleService.accessibleModules = data.accessibleModule;
            });
    }
}