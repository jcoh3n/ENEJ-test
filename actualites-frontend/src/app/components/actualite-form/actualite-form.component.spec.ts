import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActualiteFormComponent } from './actualite-form.component';

describe('ActualiteFormComponent', () => {
  let component: ActualiteFormComponent;
  let fixture: ComponentFixture<ActualiteFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActualiteFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActualiteFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
