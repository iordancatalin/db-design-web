import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VtxComponent } from '../../components/vtx/vtx/vtx.component';
import { CenterFrameComponent } from '../../components/vtx/center-frame/center-frame.component';
import { HeaderComponent } from '../../components/vtx/header/header.component';
import { SocialComponent } from '../../components/social/social.component';
import { LeftFrameComponent } from '../../components/vtx/left-frame/left-frame.component';
import { RightFrameComponent } from '../../components/vtx/right-frame/right-frame.component';
import { FontAwesomeModule } from '../font-awesome/font-awesome.module';
import { AppRoutingModule } from 'src/app/app-routing.module';

@NgModule({
  declarations: [VtxComponent, CenterFrameComponent, HeaderComponent, SocialComponent, LeftFrameComponent, RightFrameComponent],
  imports: [CommonModule, FontAwesomeModule, AppRoutingModule],
  entryComponents: [LeftFrameComponent, CenterFrameComponent, RightFrameComponent]
})
export class VortexModule { }
