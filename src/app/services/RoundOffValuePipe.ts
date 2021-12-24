import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'customRoundOffPipe' })
export class RoundOffValuePipe implements PipeTransform {
    transform(value: any): any {
        if (value == null) return 0.00;
        return Math.round(+value);
    };

}