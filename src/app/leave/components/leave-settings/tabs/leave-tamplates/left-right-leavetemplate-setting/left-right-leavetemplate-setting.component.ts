import { ChangeDetectionStrategy, Component, Input, OnInit, ViewChild } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { LeaveTamplatesComponent } from "../leave-tamplates.component";

type PaneType = 'left' | 'right';

@Component({
  selector: 'app-left-right-leavetemplate-setting',
  templateUrl: './left-right-leavetemplate-setting.component.html',
  styleUrls: ['./left-right-leavetemplate-setting.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('slide', [
      state('left', style({ transform: 'translateX(0)' })),
      state('right', style({ transform: 'translateX(-50%)' })),
      transition('* => *', animate(300))
    ])
  ]
})

export class LeftRightLeavetemplateSettingComponent implements OnInit {

  @Input() activePane: PaneType = 'left';
  // @ViewChild(LeaveTamplatesComponent) leaveTamplatesComponent:LeaveTamplatesComponent;
  constructor() { 
    // this.leaveTamplatesComponent.getAllLeaveSettingData();
  }

  ngOnInit() {
  }


}





