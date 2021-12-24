import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';

type PaneType = 'left' | 'right';

@Component({
  selector: 'app-attendance-records-panes',
  templateUrl: './attendance-records-panes.component.html',
  styleUrls: ['./attendance-records-panes.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('slide', [
      state('left', style({ transform: 'translateX(0)' })),
      state('right', style({ transform: 'translateX(-50%)' })),
      transition('* => *', animate(300))
    ])
  ]
})
export class AttendanceRecordsPanesComponent implements OnInit {
  @Input() activePane: PaneType = 'left';
  constructor() { }

  ngOnInit() {
  }

}
