import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Kdrama } from './kdrama';

describe('Kdrama', () => {
  let component: Kdrama;
  let fixture: ComponentFixture<Kdrama>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Kdrama]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Kdrama);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
