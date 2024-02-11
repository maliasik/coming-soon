import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { NgZone } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit, OnDestroy {
  targetDate = new Date('March 15, 2024 00:00:00').getTime();
  countdown: string | null = null;
  private intervalId: any;

  constructor(private zone: NgZone, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.zone.runOutsideAngular(() => {
      this.intervalId = setInterval(() => {
        const now = new Date().getTime();
        const distance = this.targetDate - now;
        this.zone.run(() => {
          if (distance < 0) {
            this.countdown = "Zaman doldu!";
            clearInterval(this.intervalId);
          } else {
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);
            this.countdown = `${days} gün ${hours} saat ${minutes} dakika ${seconds} saniye`;
          }
        });
      }, 1000);
    });
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  private updateCountdown(): void {
    const now = new Date().getTime();
    const distance = this.targetDate - now;
    if (distance < 0) {
      this.countdown = "Zaman doldu!";
      if (this.intervalId) {
        clearInterval(this.intervalId);
      }
      return;
    }
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    this.countdown = `${days} gün ${hours} saat ${minutes} dakika ${seconds} saniye`;
    this.cdr.markForCheck(); 
  }
}