import { Component, OnInit, Input, SimpleChange, OnChanges } from '@angular/core';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
declare var require: any;
const ClassicEditor = require('@ckeditor/ckeditor5-build-classic');
declare const window: any;
@Component({
  selector: 'app-templateeditor',
  templateUrl: './templateeditor.component.html',
  styleUrls: ['./templateeditor.component.scss']
})
export class TemplateeditorComponent implements OnInit,OnChanges {
  @Input()
  ckEditorContent
  constructor() {
    console.log(this.ckEditorContent)
  }
  ngOnInit() {
    console.log(this.ckEditorContent)
    console.log("template-editor working")
    this.loadScript('https://proh2r.s3.ap-south-1.amazonaws.com/ckeditor/ckeditor.js');
    // this.loadScript('assets/ckeditor/ckeditor.js');
    console.log("template-editor working")
    if (window.CKEDITOR) {
      window.CKEDITOR.replace('editor1');
    }
    ClassicEditor
      .create(document.querySelector('#editor'))
      .catch(error => {
        console.error(error);
      });
  }
  ngOnChanges(changes: {[propertyName: string]: SimpleChange}) {
    console.log(changes)
  }
  private loadScript(scriptUrl: string) {
    return new Promise((resolve, reject) => {
      const scriptElement = document.createElement('script');
      scriptElement.src = scriptUrl;
      scriptElement.onload = resolve;
      document.body.appendChild(scriptElement);
    })
  }



  // constructor() {
  //   this.loadScript('assets/ckeditor/ckeditor.js');
  // }

  // /**
  //   * FUNCTION TO INSERT CKEDITOR INSIDE CKEDITOR DIV ID
  //   */
  // ngOnInit() {
  //   if (window.CKEDITOR) {
  //     window.CKEDITOR.replace('ckeditor');
  //   }
  //   ClassicEditor
  //     .create(document.querySelector('#editor'))
  //     .catch(error => {
  //     });
  // }

  // /**
  //   * FUNCTION TO LOAD JAVASCRIPT FROM ASSET
  //   */
  // private loadScript(scriptUrl: string) {
  //   return new Promise((resolve, reject) => {
  //     const scriptElement = document.createElement('script');
  //     scriptElement.src = scriptUrl;
  //     scriptElement.onload = resolve;
  //     document.body.appendChild(scriptElement);
  //   })
  // }

}
