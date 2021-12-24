import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'customRoundUpPipe' })
export class RoundUpValuePipe implements PipeTransform {
    transform(value: any): any {
        if (value == null) return 0.00;
        return Math.ceil( +value);
    };

}