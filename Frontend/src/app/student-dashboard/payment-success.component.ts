import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-payment-success',
  template: '<p>Processing...</p>'
})
export class PaymentSuccessComponent implements OnInit {
  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    const session_id = this.route.snapshot.queryParamMap.get('session_id');
    const user_id = this.route.snapshot.queryParamMap.get('user_id');

    fetch(`https://localhost:44388/api/Payment/session-details?session_id=${session_id}&user_id=${user_id}`)
      .then(res => res.json())
      .then((isPaid: boolean) => {
        if (isPaid) this.router.navigate(['/student-dashboard/premium-courses']);
        else this.router.navigate(['/payment-cancel']);
      });
  }
}
