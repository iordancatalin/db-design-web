import { Component, Input, OnInit } from '@angular/core';

class SocialIcon {
  constructor(public icon: String, public link?: String) {}
}

@Component({
  selector: 'app-social',
  templateUrl: './social.component.html',
  styleUrls: ['./social.component.scss']
})
export class SocialComponent implements OnInit {
  @Input() horizontal = false;
  solidIcons: Array<SocialIcon>;

  constructor() {}

  ngOnInit() {
    this.solidIcons = [
      new SocialIcon('google', 'https://www.google.com'),
      new SocialIcon('facebook', 'https://www.facebook.com'),
      new SocialIcon('youtube', 'https://youtube.com'),
      new SocialIcon('twitter', 'https://twitter.com'),
      new SocialIcon('linkedin', 'https://www.linkedin.com/'),
      new SocialIcon('instagram', 'https://www.instagram.com')
    ];
  }
}
