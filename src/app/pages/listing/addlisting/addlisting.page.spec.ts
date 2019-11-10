import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddlistingPage } from './addlisting.page';

describe('AddlistingPage', () => {
  let component: AddlistingPage;
  let fixture: ComponentFixture<AddlistingPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddlistingPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddlistingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
