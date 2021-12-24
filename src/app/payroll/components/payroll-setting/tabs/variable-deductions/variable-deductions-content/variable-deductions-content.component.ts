
import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';

type PaneType = 'left' | 'right';


@Component({
  selector: 'app-variable-deductions-content',
  templateUrl: './variable-deductions-content.component.html',
  styleUrls: ['./variable-deductions-content.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('slide', [
      state('left', style({ transform: 'translateX(0)' })),
      state('right', style({ transform: 'translateX(-50%)' })),
      transition('* => *', animate(300))
    ])
  ]

})
export class VariableDeductionsContentComponent implements OnInit {

  @Input() activePane: PaneType = 'left';
  constructor() { }

  ngOnInit() {
  }

}
