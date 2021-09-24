import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';
import { SocialMediaComponent } from '../social-media/social-media.component';
import { AudioStreamControlComponent } from '../audio-stream-control/audio-stream-control.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule
  ],
  declarations: [HomePage, SocialMediaComponent, AudioStreamControlComponent]
})
export class HomePageModule {}
