import { Component, OnDestroy, OnInit } from '@angular/core';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { ModalController, Platform } from '@ionic/angular';
import { interval, Subscription } from 'rxjs';
import { NowPlaying } from '../../shared/models/now-playing.model';
import { ScheduleAppStopModalComponent } from '../schedule-app-stop-modal/schedule-app-stop-modal.component';
import { StreamAudioService } from '../../shared/services/stream-audio.service';
import { AppMinimize } from '@ionic-native/app-minimize/ngx';
import { AudioManagement } from '@ionic-native/audio-management/ngx';
import { HomeService } from './home.service';
import { BackgroundMode } from '@ionic-native/background-mode/ngx';
import { Network } from '@ionic-native/network/ngx';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {

  // constants info
  private STREAM_URL = 'https://radion.jmhost.com.br/radio/8020/;';

  // boolean value to display play button
  public showPlayBtn: boolean;

  // store audio object to be streaming
  public myAudio = new Audio(this.STREAM_URL);

  // store data related to music info to be displayed in home view from application
  public nowPlaying: NowPlaying = null;

  public musicName: string;
  public artistName: string;

  // store value related to native volume from device
  public volume: number;

  // store values related schedule timer to sleep application
  public sleepScheduleTimer: string;
  public timerFormated: number;

  // subscription to manage nowPlaying updates
  private nowPlayingSubscription = new Subscription();

  private myAudioStateSubscription = new Subscription();

  // subscription to manage the timer to sleep appication
  private timerSubscription = new Subscription();

  // subscription to manage connection state
  private disconnectSubscription = new Subscription();
  private connectSubscription = new Subscription();

  /**
   * Creates an instance of HomePage.
   *
   * @param {Platform} platform
   * @param {StreamAudioService} streamAudioService
   * @param {ModalController} modalController
   * @param {LocalNotifications} localNotifications
   * @param {AppMinimizeOriginal} appMinimize
   * @memberof HomePage
   */
  public constructor(private platform: Platform, private streamAudioService: StreamAudioService, private modalController: ModalController,
    private localNotifications: LocalNotifications, private appMinimize: AppMinimize, private network: Network,
    public audioManagement: AudioManagement, private homeService: HomeService, public backgroundMode: BackgroundMode) { }

  /**
   * Build initial values to be displayed on home screen
   *
   * @memberof HomePage
   */
  public ngOnInit() {

    this.initVariables();

    // timeout set to emmits play automatically when appolication is started
    setTimeout(() => {
      this.play();
    }, 3000);

    const sourcePlay = interval(3000);
    this.myAudioStateSubscription.add(sourcePlay.subscribe(() => {
      if(this.myAudio && !this.showPlayBtn) {
        this.myAudio.play();
      }
    }));

    // notification action button listening
    this.platform.ready().then(() => {
      this.backgroundMode.enable();
      // play music when app is runing in background mode
      this.backgroundMode.on('activate').subscribe(() => {
        this.backgroundMode.disableWebViewOptimizations();
      });

      // in case click on play action button the stream should be started
      // and new notification should be displayed
      /*this.localNotifications.on('play').subscribe(() => {
        this.play();
      });*/

      // in case click on pause action button the stream should be stopped
      // and new notification should be displayed
      /*this.localNotifications.on('pause').subscribe(() => {
        this.pause();
      });*/

      // in case click on close action button the app should be closed
      /*this.localNotifications.on('close').subscribe(() => {
        navigator['app'].exitApp(); // work in ionic 4
      });*/
    });

    // minimizes application
    this.platform.backButton.subscribe(() => {
      this.appMinimize.minimize();
    });

    // watch network for a disconnection
    this.disconnectSubscription = this.network.onDisconnect().subscribe(() => {
    });

    // watch network for a connection
    this.connectSubscription = this.network.onConnect().subscribe(() => {
    });
  }

  /**
   * starts default local variables
   *
   * @private
   * @memberof HomePage
   */
  private initVariables() {
  this.volume = 950;
  this.musicName = '';
  this.artistName = '';
  this.showPlayBtn = true;
  this.sleepScheduleTimer = 'Desligado';
  this.audioManagement.setVolume(AudioManagement.VolumeType.MUSIC, (this.volume / 100));
}

  /**
   * builds notification with PAUSE and CLOSE action button
   *
   * @private
   * @memberof HomePage
   */
  private initializePauseNotification() {
  const notificationWithPauseAction = this.homeService.buildNotificationWithCustomActionButton('Pausar', 'pause', 'ic_pause');
  this.localNotifications.schedule(notificationWithPauseAction);
}

  /**
   * builds notification with PLAY and CLOSE action button
   *
   * @private
   * @memberof HomePage
   */
  private initializePlayNotification() {
  const notificationWithPlayAction = this.homeService.buildNotificationWithCustomActionButton('Play', 'play', 'ic_play');
  this.localNotifications.schedule(notificationWithPlayAction);
}

  /**
   * This method is responsible to play the audio stream
   *
   * @memberof HomePage
   */
  public play() {
    if(this.myAudio) {
      this.nowPlayingSubscription = new Subscription();
      this.myAudio.play();
      this.showPlayBtn = false;
      // update now playing info every 3 seconds
      const source = interval(1000);
      this.nowPlayingSubscription.add(source.subscribe(() => this.loadNowPlayingData()));
    }
  
}

  /**
   * This method is responsible to pause the audio stream
   *
   * @memberof HomePage
   */
  public pause() {
  this.myAudio.load(); // This restarts the stream audio
  this.nowPlayingSubscription.unsubscribe();
  this.showPlayBtn = true;
  this.musicName = '';
  this.artistName = '';
}

  /**
   * Methdos responsible to manage the audio volume from application
   *
   * @memberof HomePage
   */
  public volumeControl() {
  this.audioManagement.setVolume(AudioManagement.VolumeType.MUSIC, (this.volume / 100));
}

  /**
   * Method responsible to loading now play data related to
   * music name and artist name played in real time
   *
   * @private
   * @memberof HomePage
   */
  private loadNowPlayingData() {
  this.streamAudioService.getNowPlaying().subscribe(result => {
    // solve play btn displaying
    if (this.showPlayBtn && this.myAudio.played) {
      this.showPlayBtn = false;
    }

    if (!this.nowPlaying) {
      this.nowPlaying = result?.now_playing;
      this.parseNowPlayingData(result);
    } else { // change play info only if there are updates.
      this.parseNowPlayingData(result);
    }
  }, (error) => {
    this.nowPlayingSubscription.unsubscribe();
    this.myAudio = null;
  });
}

  /**
   * Method is responsible to parse now playing data to display on home screen from raizUai app
   *
   * @private
   * @param {*} nowPlayingData
   * @memberof HomePage
   */
  private parseNowPlayingData(nowPlayingData: any) {
  const musicInfo = nowPlayingData?.now_playing?.song?.text.split('-');
  this.nowPlaying = nowPlayingData?.now_playing;

  // we have severous music info format and we need parse it according to each format like example below:
  // 1 - {0: Stream Offiline} -> in this case we need display just this info in application
  // 2 - {0: 'Artist Name', 1: 'Music Name' }
  // 3 - {0: 'Track Music', 1: 'Artist Name', 2: 'Music Name' }
  // 4 - {0: 'Artist Name', 1: 'Music Name', 2: 'Music Name - more info' }

  if (musicInfo && musicInfo[0] !== 'Stream Offline') {
    if (musicInfo.length > 2) {
      this.artistName = isNaN(musicInfo[0]) ? musicInfo[0] : musicInfo[1];
      this.musicName = isNaN(musicInfo[0]) ? musicInfo[1] + ' ' + musicInfo[2] : musicInfo[2];
    } else {
      this.artistName = musicInfo[0];
      this.musicName = musicInfo[1];
    }
  } else {
    this.musicName = musicInfo[0];
  }

  this.musicName = this.musicName === undefined ? '' : this.musicName;

}

  /**
   * Methdod responsible to open schedule modal to setup the application stop
   *
   * @memberof HomePage
   */
  public openModal() {
  this.modalController.create({
    component: ScheduleAppStopModalComponent,
    cssClass: 'my-custom-modal-class'
  }).then((modal) => {
    modal.onDidDismiss().then((res) => {
      // unsubscribe time subscription in case already exists
      if (this.timerSubscription) {
        this.timerSubscription.unsubscribe();
        this.timerSubscription = new Subscription();
      }
      this.sleepScheduleTimer = res.data.timer;

      // start sleepScheduleTimer count just if does not offline or if the value if zero
      if (this.sleepScheduleTimer !== 'Desligado' && this.sleepScheduleTimer !== '00:00:00') {
        this.timerFormated = this.homeService.convertStringTimerFormat(this.sleepScheduleTimer);
        // request now playing data every 1 second
        const source = interval(1000);
        this.timerSubscription.add(source.subscribe(() => this.updateDisplay()));
      }

    });
    modal.present();
  });
}

  /**
   * Method is responsible to decrement and display the schedule sleep timer
   *
   * @private
   * @memberof HomePage
   */
  private updateDisplay() {
  if (this.sleepScheduleTimer !== '00:00:00') {
    this.timerFormated--;
    this.sleepScheduleTimer = this.homeService.convertNumberTimerFormat(this.timerFormated);
  } else {
    this.timerFormated = 0;
    this.timerSubscription.unsubscribe();
    // pause audio streaming
    this.pause();
    this.sleepScheduleTimer = 'Desligado';
  }
}

  /**
   * grants that all subscriptions are finished
   *
   * @memberof HomePage
   */
  public ngOnDestroy() {
  if (this.nowPlayingSubscription) {
    this.nowPlayingSubscription.unsubscribe();
  }
  if (this.timerSubscription) {
    this.timerSubscription.unsubscribe();
  }
  if (this.disconnectSubscription) {
    this.disconnectSubscription.unsubscribe();
  }
  if (this.connectSubscription) {
    this.connectSubscription.unsubscribe();
  }
  if(this.myAudioStateSubscription) {
    this.myAudioStateSubscription.unsubscribe();
  }
}
}
