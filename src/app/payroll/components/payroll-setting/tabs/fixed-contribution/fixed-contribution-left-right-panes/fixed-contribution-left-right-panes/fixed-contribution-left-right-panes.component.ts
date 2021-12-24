import { Component, OnInit, ChangeDetectionStrategy, Input, AfterViewInit } from '@angular/core';
import { trigger, state, transition, animate, style } from '@angular/animations';
type PaneType = 'left' | 'right';
@Component({
  selector: 'app-fixed-contribution-left-right-panes',
  templateUrl: './fixed-contribution-left-right-panes.component.html',
  styleUrls: ['./fixed-contribution-left-right-panes.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('slide', [
      state('left', style({ transform: 'translateX(0)' })),
      state('right', style({ transform: 'translateX(-50%)' })),
      transition('* => *', animate(300))
    ])
  ]
})
export class FixedContributionLeftRightPanesComponent implements OnInit, AfterViewInit {
  @Input() activePane: PaneType = 'left';
  constructor() { }

  ngOnInit() {
  }
  ngAfterViewInit() { }

}
