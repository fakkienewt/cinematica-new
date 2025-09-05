import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Anime } from './anime';

describe('Anime', () => {
  let component: Anime;
  let fixture: ComponentFixture<Anime>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Anime]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Anime);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
