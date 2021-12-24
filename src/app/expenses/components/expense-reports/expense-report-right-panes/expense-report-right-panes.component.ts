import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';

type PaneType = 'left' | 'right';

@Component({
  selector: 'app-expense-report-right-panes',
  templateUrl: './expense-report-right-panes.component.html',
  styleUrls: ['./expense-report-right-panes.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('slide', [
      state('left', style({ transform: 'translateX(0)' })),
      state('right', style({ transform: 'translateX(-50%)' })),
      transition('* => *', animate(300))
    ])
  ]
})
export class ExpenseReportRightPanesComponent implements OnInit {
  @Input() activePane: PaneType = 'left';
  constructor() { }

  ngOnInit() {
  }

}
 