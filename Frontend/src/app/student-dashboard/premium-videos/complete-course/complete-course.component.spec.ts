import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompleteCourseComponent } from './complete-course.component';

describe('CompleteCourseComponent', () => {
  let component: CompleteCourseComponent;
  let fixture: ComponentFixture<CompleteCourseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompleteCourseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompleteCourseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
