import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'statuspipe'
})
export class StatusPipe implements PipeTransform {
    transform(value: string): string {
        switch (value) {

            case 'COMPLETE_APPROVAL_PENDING': {
                return "Approval Pending";
            }
            case 'COMPLETE_APPROVED': {
                return "Complete";
            }
            case 'COMPLETE_REJECTED': {
                return "Rejected";
            }

            default: {
                return value;
            }

        }
    }
}

@Pipe({
    name: 'manual'
})
export class ManualPipe implements PipeTransform {
    transform(value: string): string {
        if(value==="MANUALLY"||value==="Manually")
        return "Manual";
    }
}