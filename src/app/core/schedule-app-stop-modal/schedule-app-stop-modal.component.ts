import { Component, HostListener, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-schedule-app-stop-modal',
  templateUrl: './schedule-app-stop-modal.component.html',
  styleUrls: ['./schedule-app-stop-modal.component.scss'],
})
export class ScheduleAppStopModalComponent implements OnInit {

  public isDragging: boolean;
  public timer: string;

  /**
   * Creates an instance of ScheduleAppStopModalComponent.
   *
   * @param {ModalController} modalCtrl
   * @memberof ScheduleAppStopModalComponent
   */
  public constructor(public modalCtrl: ModalController) { }

  /**
   * import circle range slider
   *
   * @memberof ScheduleAppStopModalComponent
   */
  ngOnInit() {
    this.isDragging = false;
    this.timer = 'Desligado';
  }

  // event listener to mousedown and touchstart
  @HostListener('mousedown', ['$event'])
  @HostListener('touchstart', ['$event'])
  onMousedown(e) {
    this.isDragging = true;
  }

  // event listener to mousedown and touchsend
  @HostListener('mousedown', ['$event'])
  @HostListener('touchend', ['$event'])
  onMouseup(e) {
    this.isDragging = false;
  }

  // event listener to mousemove and touchmove
  @HostListener('mousemove', ['$event'])
  @HostListener('touchmove', ['$event'])
  onMousemove(e) {
    let angle;
    let centerX;
    let centerY;
    let circleElement;
    let deltaX;
    let deltaY;
    let posX;
    let posY;
    let touch;

    if (this.isDragging) {
      circleElement = document.getElementsByClassName('circle');

      touch = void 0;
      if (e.targetTouches) {
        touch = e.targetTouches[0];
      }
      centerX = $(circleElement).outerWidth() / 2 + $(circleElement).offset().left;
      centerY = $(circleElement).outerHeight() / 2 + $(circleElement).offset().top;
      posX = e.pageX || touch.pageX;
      posY = e.pageY || touch.pageY;
      deltaY = centerY - posY;
      deltaX = centerX - posX;
      angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI); // Calculate Angle between circle center and mouse pos
      angle -= 90;
      if (angle < 0) {
        angle = 360 + angle; // Always show angle positive
      }
      angle = Math.round(angle);
      if (angle > 0 && angle <= 5) {
        this.timer = 'Desligado';
      }
      else if (angle > 5 && angle <= 30) {
        this.timer = '00:10:00';
      }
      else if (angle > 30 && angle <= 60) {
        this.timer = '00:20:00';
      }
      else if (angle > 60 && angle <= 90) {
        this.timer = '00:30:00';
      }
      else if (angle > 90 && angle <= 120) {
        this.timer = '00:40:00';
      }
      else if (angle > 120 && angle <= 150) {
        this.timer = '00:50:00';
      }
      else if (angle > 150 && angle <= 180) {
        this.timer = '00:60:00';
      }
      else if (angle > 180 && angle <= 210) {
        this.timer = '01:00:00';
      }
      else if (angle > 210 && angle <= 240) {
        this.timer = '01:10:00';
      }
      else if (angle > 240 && angle <= 270) {
        this.timer = '01:20:00';
      }
      else if (angle > 270 && angle <= 300) {
        this.timer = '01:30:00';
      }
      else if (angle > 300 && angle <= 330) {
        this.timer = '01:40:00';
      }
      else if (angle > 330 && angle < 350) {
        this.timer = '01:50:00';
      }
      else if (angle > 350) {
        this.timer = '02:00:00';
      }
      $('.dot').css('transform', 'rotate(' + angle + 'deg)');
      return $('.debug').html(this.timer);
    }
  }

  /**
   * Method responsible to close modal
   *
   * @memberof ScheduleAppStopModalComponent
   */
  public saveTimer() {
    this.modalCtrl.dismiss({
      timer: this.timer
    });

  }
}
