import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyUploadedCoursesComponent } from './my-uploaded-courses.component';

describe('MyUploadedCoursesComponent', () => {
  let component: MyUploadedCoursesComponent;
  let fixture: ComponentFixture<MyUploadedCoursesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyUploadedCoursesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyUploadedCoursesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
