import { Component, Input } from '@angular/core';
import { NgClass, NgFor } from '@angular/common';

interface Toast {
  message: string;
  visible: boolean;
  status: 'success' | 'error' | 'warning';
}

@Component({
  selector: 'app-toast',
  imports: [NgFor, NgClass],
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.css'],
})
export class ToastComponent {
  toasts: Toast[] = [];
  messageStatus: 'success' | 'error' | 'warning' = 'success';

  showToast(
    message: string,
    status: 'success' | 'error' | 'warning' = 'success',
    duration: number = 3000
  ): void {
    const toast: Toast = { message, visible: true, status };
    this.toasts.push(toast);

    setTimeout(() => {
      toast.visible = false;
      setTimeout(() => {
        this.toasts = this.toasts.filter((t) => t !== toast);
      }, 400);
    }, duration);
  }
}
