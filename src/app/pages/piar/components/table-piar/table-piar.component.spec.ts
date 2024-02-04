import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablePiarComponent } from './table-piar.component';

describe('TablePiarComponent', () => {
  let component: TablePiarComponent;
  let fixture: ComponentFixture<TablePiarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TablePiarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TablePiarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
