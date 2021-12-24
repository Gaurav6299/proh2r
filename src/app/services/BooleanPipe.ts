import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'customBooleanPipe' })
export class BooleanPipe implements PipeTransform {
    transform(value: boolean): string {
        return value == true ? 'Yes' : 'No'
    };
}