import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'customUnderscorePipe' })
export class ReplaceUnderscorePipe implements PipeTransform {
    transform(value: String): string {
        if (value == null) return "";
        return value.replace(/_/g, " ");
    };

}