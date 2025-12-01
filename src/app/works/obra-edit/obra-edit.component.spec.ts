import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ObraEditComponent } from './obra-edit.component';

describe('ObraEditComponent', () => {
  let component: ObraEditComponent;
  let fixture: ComponentFixture<ObraEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ObraEditComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ObraEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
