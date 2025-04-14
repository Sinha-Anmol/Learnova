import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CloudSupportComponent } from './cloud-support.component';

describe('CloudSupportComponent', () => {
  let component: CloudSupportComponent;
  let fixture: ComponentFixture<CloudSupportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CloudSupportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CloudSupportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
