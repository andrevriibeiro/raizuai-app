import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-audio-stream-control',
  templateUrl: './audio-stream-control.component.html',
  styleUrls: ['./audio-stream-control.component.scss'],
})
export class AudioStreamControlComponent implements OnInit {

    // store value related to native volume from device
    public volume: number;

  constructor() { }

  ngOnInit() { }


  /**
   * Methdos responsible to manage the audio volume from application
   *
   * @memberof HomePage
   */
  public volumeControl() {
    // this.myAudio.volume = this.volume / 100;
  }

}
