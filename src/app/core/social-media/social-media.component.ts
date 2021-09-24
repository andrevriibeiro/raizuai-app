import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { InAppBrowser, InAppBrowserObject } from '@ionic-native/in-app-browser/ngx';
import { AppAvailability } from '@ionic-native/app-availability/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';

@Component({
  selector: 'app-social-media',
  templateUrl: './social-media.component.html',
  styleUrls: ['./social-media.component.scss'],
})
export class SocialMediaComponent {

  // contains the whatsApp URL from RaizUai
  public whatsAppURL = 'https://wa.me/5537991825034';

  /**
   * Creates an instance of SocialMediaComponent.
   *
   * @param {Platform} platform
   * @param {AppAvailability} appAvailability
   * @param {InAppBrowser} inAppBrowser
   * @param {SocialSharing} socialSharing
   * @memberof SocialMediaComponent
   */
  public constructor(private platform: Platform, private appAvailability: AppAvailability, private inAppBrowser: InAppBrowser,
                     private socialSharing: SocialSharing) { }

  /**
   * Opens raizUai facebook page
   *
   * @memberof SocialMediaComponent
   */
  public openFacebookApp() {

    let app;

    if (this.platform.is('ios')) {
      app = 'fb://';
    } else if (this.platform.is('android')) {
      app = 'com.facebook.katana';
    } else {
      const browser: InAppBrowserObject = this.inAppBrowser.create('https://www.instagram.com/raizuai', '_system');
      return;
    }

    this.appAvailability.check(app)
      .then(
        (yes: boolean) => {
          const browser: InAppBrowserObject = this.inAppBrowser.create('fb://profile/' + '100055906614044', '_system');
        },
        (no: boolean) => {
          const browser: InAppBrowserObject = this.inAppBrowser.create('https://www.facebook.com/raizuai', '_system');
        }
      );
  }

  /**
   * Opens raizUai instagram page
   *
   * @returns
   * @memberof SocialMediaComponent
   */
  public openInstagramApp() {

    let app;

    if (this.platform.is('ios')) {
      app = 'instagram://';
    } else if (this.platform.is('android')) {
      app = 'com.instagram.katana';
    } else {
      const browser: InAppBrowserObject = this.inAppBrowser.create('https://www.instagram.com/raizuai');
      return;
    }

    this.appAvailability.check(app)
      .then(
        (yes: boolean) => {
          const browser: InAppBrowserObject = this.inAppBrowser.create('instagram://media' +
            'https://www.instagram.com/raizuai/', '_system');
        },
        (no: boolean) => {
          const browser: InAppBrowserObject = this.inAppBrowser.create('https://www.instagram.com/' +
            'raizuai', '_system');
        }
      );
  }

  public openWhatsApp() {
    const browser: InAppBrowserObject = this.inAppBrowser.create(this.whatsAppURL, '_system');
  }

  /**
   * Opens functionality to share the raizUai app
   *
   * @returns
   * @memberof SocialMediaComponent
   */
  public sharingApp() {
    this.socialSharing.share('Mensagem de compartilhamento da rádio RaizUai', null, null, 'https://www.instagram.com/raizuai/');
  }
}
