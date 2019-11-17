import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditlistingPage } from './editlisting.page';

describe('EditlistingPage', () => {
  let component: EditlistingPage;
  let fixture: ComponentFixture<EditlistingPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditlistingPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditlistingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
