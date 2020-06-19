import { Component, ChangeDetectionStrategy, ChangeDetectorRef, AfterViewInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, RouterLinkActive } from '@angular/router';
import { FormBuilder, FormArray, FormGroup, FormControl } from '@angular/forms';
import { UserExceptions } from '../../models';
import { UserExceptionsService, LoggerService } from '../services';;
import { Subscription, Observable } from "rxjs";
import { APP } from '../../variables';
import * as _ from 'lodash';
@Component({
  selector: 'user-exceptions',
  templateUrl: '../templates/user-exceptions.component.html',
  styleUrls: ['../styles/user-exceptions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExceptionsComponent implements OnDestroy {
  private currentDoc: { activePath: string, content: string } = { activePath: '', content: '' };
  private subscriptions: Subscription = new Subscription();
  private userExceptions: UserExceptions;

  private exceptionsForm: FormGroup;
  private exceptionsFormItems: FormArray;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private exceptionsService: UserExceptionsService,
    private loggerService: LoggerService,
    private formBuilder: FormBuilder
  ) {
    this.currentDoc.content = this.lang.docs__md.userExceptions.join('');
  }
  private get lang() {
    return APP.lang.userExceptions.component;
  }

  save() {
    let error = this.exceptionsService.set(Object.fromEntries(this.exceptionsForm.value.items
      .filter((item: any)=>item.oldTitle)
      .map((item: any)=>[item.oldTitle,_.omit(item,'oldTitle')])
    )||{})
    if(!error) {
      this.exceptionsService.saveUserExceptions();
    }
  }

  deleteAll() {
    this.exceptionsFormItems = this.exceptionsForm.get('items') as FormArray;
    while(this.exceptionsFormItems.length>0) {
      this.exceptionsFormItems.removeAt(0);
    }
  }

  createItem(): FormGroup {
    return this.formBuilder.group({
      oldTitle:'',
      newTitle:'',
      commandLineArguments: '',
      exclude: false
    })
  }

  setForm() {
    this.exceptionsForm = this.formBuilder.group({
      items: this.formBuilder.array(Object.entries(this.userExceptions)
        .map(e=>this.formBuilder.group(Object.assign({oldTitle: e[0]},e[1]))))
    });
    this.exceptionsForm.valueChanges.subscribe((val)=>{
      this.exceptionsService.setIsUnsaved(true);
      let error = this.exceptionsService.set(Object.fromEntries(val.items
        .filter((item: any)=>item.oldTitle)
        .map((item: any)=>[item.oldTitle,_.omit(item,'oldTitle')])
      )||{})


    })
    this.exceptionsService.setIsUnsaved(false);
  }

  addItem() {
    this.exceptionsFormItems = this.exceptionsForm.get('items') as FormArray;
    this.exceptionsFormItems.push(this.createItem());
  }
  deleteItem(index: number) {
    this.exceptionsFormItems = this.exceptionsForm.get('items') as FormArray;
    this.exceptionsFormItems.removeAt(this.exceptionsFormItems.value.findIndex((exception: any) => exception.id === index))
  }

  ngOnInit() {
    this.exceptionsService.setIsUnsaved(false);
    this.subscriptions.add(this.exceptionsService.dataObservable.subscribe((data)=>{
      if(!this.exceptionsService.isUnsaved){
        this.userExceptions = data;
        this.setForm();
      }

    }));
  }

  ngOnDestroy () {
    console.log('leaving component')
    this.subscriptions.unsubscribe()
  }
}
