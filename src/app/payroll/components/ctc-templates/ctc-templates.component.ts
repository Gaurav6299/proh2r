import { Component, OnInit } from '@angular/core';
import { KeycloakService } from '../../../keycloak/keycloak.service';
@Component({
  selector: 'app-ctc-templates',
  templateUrl: './ctc-templates.component.html',
  styleUrls: ['./ctc-templates.component.scss']
})
export class CtcTemplatesComponent implements OnInit {
  constructor() { 
    var rolesArr = KeycloakService.getUserRole();
  }

  ngOnInit() {
  }

  addCTCTemplate(){

    

    console.log('---------------------Adding new CTC Template---------------------');
  }

}
