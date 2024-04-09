import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Media } from '../models/media.model';

@Injectable({
  providedIn: 'root',
})
export class MediasHttpService {
  constructor(private http: HttpClient) {}

  uploadMedia(file: File, metadata: Pick<Media, 'creator_id' | 'event_id'>) {
    const formData = new FormData();
    formData.append('file', file, file.name);
    formData.append('creator_id', metadata.creator_id);
    formData.append('event_id', metadata.event_id);

    return this.http.post<Media>('@api/medias', formData, {
      withCredentials: true,
    });
  }
}
