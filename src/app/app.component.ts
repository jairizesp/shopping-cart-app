import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavComponent } from './components/nav/nav.component';
import { FooterComponent } from './components/footer/footer.component';
import { ToastComponent } from './components/toast/toast.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  title = 'shopping-cart-app';

  ngOnInit(): void {
    localStorage.setItem('promo_code', 'SAVE10');

    const hasUsedPromoCode = localStorage.getItem('has_used_promo_code');

    if (!hasUsedPromoCode) {
      localStorage.setItem('has_used_promo_code', 'false');
    }
  }
}
