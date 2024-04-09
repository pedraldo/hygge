import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMessageModule, NzMessageService } from 'ng-zorro-antd/message';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../auth/auth.service';
import { MediasHttpService } from '../../../http/medias-http.service';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    NzButtonModule,
    NzIconModule,
    NzMessageModule,
  ],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss',
})
export class FooterComponent implements OnInit, OnDestroy {
  @ViewChild('inputFile') inputTemplateRef!: ElementRef<HTMLInputElement>;

  subscriptions: Subscription[] = [];
  userProfile!: User;

  constructor(
    private message: NzMessageService,
    private authService: AuthService,
    private mediasHttpService: MediasHttpService
  ) {}

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
    this.subscriptions = [];
  }

  onCameraClick() {
    this.subscriptions.push(
      this.authService.userProfile.subscribe((userProfile) => {
        if (userProfile.target_event?.id) {
          this.userProfile = userProfile;
          this.inputTemplateRef.nativeElement.click();
        } else {
          // Use potentially a signal to trigger click on event-target-switcher button in the layout header
          this.message.create(
            'warning',
            "Veuillez sélectionner un évènement cible en cliquant sur le bouton en haut à droite de l'écran."
          );
        }
      })
    );
  }

  onInputFileChange(event: Event) {
    const element = event.currentTarget as HTMLInputElement;
    let fileList: FileList | null = element.files;
    if (fileList) {
      const file = fileList[0];
      if (file.size > 10000000) {
        this.message.create(
          'warning',
          'Le fichier image a une taille supérieure à 10Mo.'
        );
      } else {
        const creator_id = this.userProfile.id;
        const event_id = this.userProfile.target_event!.id;
        this.subscriptions.push(
          this.mediasHttpService
            .uploadMedia(file, { creator_id, event_id })
            .subscribe()
        );
      }
    }

    // Upload image and link to relative event
    // ...
  }
}
