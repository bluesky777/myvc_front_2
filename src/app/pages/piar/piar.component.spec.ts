import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PiarComponent } from './piar.component';

describe('PiarComponent', () => {
  let component: PiarComponent;
  let fixture: ComponentFixture<PiarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PiarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PiarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
