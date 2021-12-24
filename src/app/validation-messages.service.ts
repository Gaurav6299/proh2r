import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { validateConfig } from '@angular/router/src/config';
import { isString } from 'util';
import { isIP } from 'net';
import { isEmpty } from 'rxjs/operators/isEmpty';



const validCharacters = /[^\s\w,.:&\/()+%'`@-]/;

@Injectable()

export class ValidationMessagesService extends Validators {

  private requiredTextField = new BehaviorSubject<string>('Field is required');
  currentRequiredTextField = this.requiredTextField.asObservable();

  private requiredRadioButton = new BehaviorSubject<string>('Choose atleast one');
  currentRequiredRadioButton = this.requiredRadioButton.asObservable();

  private requiredDropdownButton = new BehaviorSubject<string>('Please Select atleast one');
  currentRequiredDropdownButton = this.requiredDropdownButton.asObservable();

  private requiredDateButton = new BehaviorSubject<string>('Please Enter the Date');
  currentRequiredDateButton = this.requiredDateButton.asObservable();

  private invalidInputValue = new BehaviorSubject<string>('Enter valid email');
  currentInputValue = this.invalidInputValue.asObservable();
  validLength: boolean;

  public validateLabel(control: AbstractControl): { [key: string]: boolean } | null {
    if (control.value != null || control.value !== undefined) {
      return { 'vadidatelabel': true };
    } else {
      return null;
    }
  }

  // /^(\+\d{1,3}[- ]?)?\d{10}$/
  public contactNumberValidation(control: AbstractControl): ValidationMessageObject | null {
    if (control.value !== undefined && control.value !== '' && control.value !== null) {
      console.log('dsfkljhsd;lkhf;lskdf');
      const valueString: string = control.value;
      const pattern = /^(\+\d{1,3}[- ]?)?\d{10}$/;
      // const isValid = valueString.match(pattern);3
      const regexp = new RegExp(pattern);
      const isValid = regexp.test(valueString);
      console.log('isValid ::::' + isValid);
      if (!isValid) {
        const validationMessageObject: ValidationMessageObject = {
          errorStatus: true,
          messages: 'Please enter valid contact number.'
        };
        return validationMessageObject;
      }
    }
    return null;
  }


  /**
   *
   * @param control formControl value as input type
   * Use to Validate PAN Number 10 ALPHANUMERIC value , do not contain special characters
   * Formatter : {5}ALPHABATE {4}NUMBER {1}ALPHABATE
   *
   */
  public panCardValidation(control: AbstractControl): ValidationMessageObject | null {
    if (control.value !== undefined && control.value !== '' && control.value !== null) {
      const valueString: string = control.value;
      const pattern = /^[A-Za-z]{5}[0-9]{4}[A-Za-z]{1}$/;
      const regexp = new RegExp(pattern);
      const isValid = regexp.test(valueString);
      console.log('isValid ::::' + isValid);
      if (!isValid) {
        const validationMessageObject: ValidationMessageObject = {
          errorStatus: true,
          messages: 'Invalid PAN Number'
        };
        return validationMessageObject;
      }
    }
    return null;
  }

    /**
   *
   * @param control formControl value as input type
   * Use to Validate PAN Number 10 ALPHANUMERIC value , do not contain special characters
   * Formatter : {5}ALPHABATE {4}NUMBER {1}ALPHABATE
   *
   */
  public bankAccountNumberValidation(control: AbstractControl): ValidationMessageObject | null {
    if (control.value !== undefined && control.value !== '' && control.value !== null) {
      const valueString: string = control.value;
      const pattern = /^\d{9,18}$/;
      const regexp = new RegExp(pattern);
      const isValid = regexp.test(valueString);
      console.log('isValid ::::' + isValid);
      if (!isValid) {
        const validationMessageObject: ValidationMessageObject = {
          errorStatus: true,
          messages: 'Invalid Bank Account Number'
        };
        console.log(validationMessageObject);
        return validationMessageObject;
     
      }
    }
    return null;
  }

  /**
   *
   * @param control formControl value as input type
   * Use to Validate 10 ALPHANUMERIC value, do not contain special characters
   *
   */
  public TANNumberValidation(control: AbstractControl): ValidationMessageObject | null {
    if (control.value !== undefined && control.value !== '' && control.value !== null) {
      const valueString: string = control.value;
      // const pattern = /^([A-Z0-9]{10})+$/;
      // // const pattern = /^[A-Za-z]{5}[0-9]{4}[A-Za-z]{1}$/;
      // const regexp = new RegExp(pattern);
      // const isValid = regexp.test(valueString);

      const pattern = /^[A-Za-z]{4}[0-9]{5}[A-Za-z]{1}$/;
      const regexp = new RegExp(pattern);
      const isValid = regexp.test(valueString);
      console.log('isValid ::::' + isValid);
      if (!isValid) {
        const validationMessageObject: ValidationMessageObject = {
          errorStatus: true,
          messages: 'Invalid TAN Number'
        };
        return validationMessageObject;
      }
    }
    return null;
  }


  /**
   *
   * @param control formControl value as input type
   * Use to Validate Only Text value or a String value Enter by the user from UI
   *
   */
  public textTypeStringValidation(control: AbstractControl): ValidationMessageObject | null {
    if (control.value !== undefined && control.value !== '' && control.value !== null) {
      const valueString: string = control.value;
      const pattern = /^[a-zA-Z ]*$/;
      const regexp1 = new RegExp('[<>%!@#%^&*()~`";?|\$]');
      const regexp = new RegExp(pattern);

      if (regexp1.test(valueString)) {
        const validationMessageObject: ValidationMessageObject = {
          errorStatus: true,
          messages: 'Invalid input: Please remove/change the offending characters.'
        };
        return validationMessageObject;
      } else {
        const pttrn = /^\s*/;
        const length2Space = valueString.toString().match(pttrn)[0].length;

        if (length2Space >= 1) {
          const validationMessageObject: ValidationMessageObject = {
            errorStatus: true,
            messages: 'Invalid input ! Empty Space not allowed, Please remove empty space.'
          };
          return validationMessageObject;
        } else {
          const isValid = regexp.test(valueString);
          console.log('isValid ::::' + isValid);
          if (!isValid) {
            const validationMessageObject: ValidationMessageObject = {
              errorStatus: true,
              messages: 'Invalid input ! Please enter alphabates only'
            };
            return validationMessageObject;
          }
        }
        // const isValid = regexp.test(valueString);
        // console.log('isValid ::::' + isValid);
        // if (!isValid) {
        //   const validationMessageObject: ValidationMessageObject = {
        //     errorStatus: true,
        //     messages: 'Invalid input ! Please enter alphabates only'
        //   };
        //   return validationMessageObject;
        // }
      }
    }
    return null;
  }


  /**
   *
   * @param control formControl value as input type
   * Use to Validate ALPHANUMERIC value , do not contain special characters
   * Formatter : ALPHABATE
   *
   */
  public alphaNumericValidation(control: AbstractControl): ValidationMessageObject | null {
    if (control.value !== undefined && control.value !== '' && control.value !== null) {
      const valueString: string = control.value.trim();
      const regexp = new RegExp('[A-Za-z0-9]+$');
      const regexp1 = new RegExp('[<>%!@#%^&*()~`";?:.|\$]');
      const regexp2 = new RegExp('[0-9]+$');


      // if(regexp2.test(valueString)) {
      //   const validationMessageObject: ValidationMessageObject = {
      //     errorStatus: true,
      //     messages: 'Invalid input: Number is not allowed'
      //   };
      //   return validationMessageObject;
      // }else 
      if (regexp1.test(valueString)) {
        const validationMessageObject: ValidationMessageObject = {
          errorStatus: true,
          messages: 'Invalid input: Please remove/change the offending characters.'
        };
        return validationMessageObject;
      } else {
        const isValid1 = regexp.test(valueString);
        if (!isValid1) {
          const validationMessageObject: ValidationMessageObject = {
            errorStatus: true,
            messages: 'Invalid input: Please enter only Alphanumeric value.'
          };
          return validationMessageObject;
        }
      }
    }
    return null;
  }


  /**
   *
   * @param control formControl value as input type
   * Use to Validate NUMERIC value , do not contain special characters
   * Formatter : Numberic : Decimal Limit
   *
   */
  public numericValidation(control: AbstractControl): ValidationMessageObject | null {
    if (control.value !== undefined && control.value !== '' && control.value !== null) {
      const valueString: string = control.value;
      const regexp = new RegExp('[A-Za-z]+$');
      const regexp1 = new RegExp('[-/<>%!@#%^&*()~`";?:|\$]');
      if ((regexp1.test(valueString) || regexp.test(valueString))) {
        const validationMessageObject: ValidationMessageObject = {
          errorStatus: true,
          messages: 'Invalid input: Please remove/change the offending characters'
        };
        return validationMessageObject;
      } else {
        // const isValid1 = regexp.test(valueString);
        // if (!isValid1) {
        const value = valueString.toString().split('.').length;
        if (value > 2) {
          const validationMessageObject: ValidationMessageObject = {
            errorStatus: true,
            messages: 'Invalid input ! Please enter valid Number'
          };
          return validationMessageObject;
        }
        // const validationMessageObject: ValidationMessageObject = {
        //   errorStatus: true,
        //   messages: 'Invalid input ! Please enter only Alphanumeric value >>>>>>>>>>.'
        // };
        // return validationMessageObject;
        // }
      }
    }
    return null;
  }


  /**
   *
   * @param control formControl value as input type
   * Use to Validate NUMERIC value , do not contain special characters 
   * Formatter : Numberic : No Decimal Value
   *
   */
  public numericWithoutDecimalValidation(control: AbstractControl): ValidationMessageObject | null {
    if (control.value !== undefined && control.value !== '' && control.value !== null) {
      const valueString: string = control.value;
      const regexp = new RegExp('[A-Za-z]+$');
      const regexp1 = new RegExp('[.-/<>%!@#%^&*()~`";?:|\$]');
      if ((regexp1.test(valueString) || regexp.test(valueString))) {
        const validationMessageObject: ValidationMessageObject = {
          errorStatus: true,
          messages: 'Invalid input: Please remove/change the offending characters'
        };
        return validationMessageObject;
      } else {
        const value = valueString.toString().split('.').length;
        if (value > 2) {
          const validationMessageObject: ValidationMessageObject = {
            errorStatus: true,
            messages: 'Invalid input ! Please enter valid Number'
          };
          return validationMessageObject;
        }
      }
    }
    return null;
  }


  /**
   *
   * @param control formControl value as input type
   * Use to Validate Required value , do not contain special characters or decimals
   * Formatter : Required: Decimal Limit
   *
   */
  public requiredValidation(control: AbstractControl): ValidationMessageObject | null {
    console.log(control.value);
    if (control.value === '') {

    } else if (control.value !== undefined && control.value !== null) {
      const validationMessageObject: ValidationMessageObject = {
        errorStatus: true,
        messages: 'Field is Required'
      };
      return validationMessageObject;
    }
    return null;
  }

}
/**
  *
  * @param control formControl value as input type
  * Use to Validate Required value , do not contain special characters or decimals
  * Formatter : Required: Decimal Limit
  *
  */



export interface ValidationMessageObject {
  errorStatus: boolean;
  messages: string;
}
