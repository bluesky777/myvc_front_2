import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActasDeAcuerdoComponent } from './actas-de-acuerdo.component';

describe('ActasDeAcuerdoComponent', () => {
  let component: ActasDeAcuerdoComponent;
  let fixture: ComponentFixture<ActasDeAcuerdoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActasDeAcuerdoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActasDeAcuerdoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
