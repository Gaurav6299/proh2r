import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';


type PaneType = 'left' | 'right';
@Component({
  selector: 'app-left-right-resignation-settings',
  templateUrl: './left-right-resignation-settings.component.html',
  styleUrls: ['./left-right-resignation-settings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('slide', [
      state('left', style({ transform: 'translateX(0)' })),
      state('right', style({ transform: 'translateX(-50%)' })),
      transition('* => *', animate(300))
    ])
  ]
})
export class LeftRightResignationSettingsComponent implements OnInit {

  constructor() { }
  @Input() activePane: PaneType = 'left';

  ngOnInit() {
  }

}