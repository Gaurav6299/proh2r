import { Directive, HostListener, forwardRef, ChangeDetectorRef } from "@angular/core";
import { NG_VALUE_ACCESSOR, ControlValueAccessor, DefaultValueAccessor } from "@angular/forms";

@Directive({
  selector: "input[type=file]",
  host: {
    "(change)": "onChange($event.target.files)",
    "(blur)": "onTouched()"
  },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FileValueAccessor),
      multi: true
    }
  ]
})
export class FileValueAccessor implements ControlValueAccessor {
  value: any;
  onChange = (_) => { };
  onTouched = () => { };
  constructor(private _cdr: ChangeDetectorRef){}
  writeValue(value) { }
  registerOnChange(fn: any) { this.onChange = fn; }
  registerOnTouched(fn: any) { this.onTouched = fn; }
}