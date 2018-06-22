import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListModulesComponent } from './list-modules.component';

describe('ListModulesComponent', () => {
  let component: ListModulesComponent;
  let fixture: ComponentFixture<ListModulesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListModulesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListModulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
