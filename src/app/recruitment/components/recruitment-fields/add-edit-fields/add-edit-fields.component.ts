import { Component, OnInit, ChangeDetectionStrategy, Input } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';


type PaneType = 'left' | 'right';
@Component({
  selector: 'app-add-edit-fields',
  templateUrl: './add-edit-fields.component.html',
  styleUrls: ['./add-edit-fields.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('slide', [
      state('left', style({ transform: 'translateX(0)' })),
      state('right', style({ transform: 'translateX(-50%)' })),
      transition('* => *', animate(300))
    ])
  ]
})
export class AddEditFieldsComponent implements OnInit {
  @Input() activePane: PaneType = 'left';
  constructor() { }

  ngOnInit() {
  }

}
