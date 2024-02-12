import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContextoFamiliarComponent } from './contexto-familiar.component';

describe('ContextoFamiliarComponent', () => {
  let component: ContextoFamiliarComponent;
  let fixture: ComponentFixture<ContextoFamiliarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContextoFamiliarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ContextoFamiliarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
