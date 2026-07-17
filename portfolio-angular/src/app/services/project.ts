import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

export type ProjectType = 'developer' | 'designer';

export interface InstagramPost {
  handle: string;
  images: string[];
}

export interface BeforeAfter {
  before: string;
  after: string;
  beforeLabel?: string;
  afterLabel?: string;
}

export interface Project {
  id: string;
  type: ProjectType;
  title: string;
  shortDescription: string;
  thumbnail: string;
  fullImage: string;
  thumbnailBackground?: string;
  gallery?: string[];
  beforeAfter?: BeforeAfter;
  instagramPosts?: InstagramPost[];
  instagramHandle?: string;
  instagramUrl?: string;
  technologies: string[];
  longDescription: string;
  features: string[];
  demoUrl?: string;
  githubUrl?: string;
  liveDemoEnable?: boolean;
  githubUrlEnable?: boolean;
}

interface ProjectResponse {
  projects: Array<
    Omit<
      Project,
      | 'liveDemoEnable'
      | 'githubUrlEnable'
      | 'type'
      | 'gallery'
      | 'instagramPosts'
      | 'beforeAfter'
    > & {
      type?: ProjectType;
      gallery?: string[];
      beforeAfter?: {
        before: string;
        after: string;
        beforeLabel?: string;
        afterLabel?: string;
      };
      instagramPosts?: Array<{ handle: string; images: string[] }>;
      liveDemoEnable?: string;
      githubUrlEnable?: string;
    }
  >;
}

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  private readonly dataPath = 'assets/data/projects.json';

  constructor(private http: HttpClient) {}

  getProjects(): Observable<Project[]> {
    return this.http.get<ProjectResponse>(this.dataPath).pipe(
      map((response) =>
        response.projects.map((project) => ({
          ...project,
          type: project.type ?? 'developer',
          thumbnail: this.normalizeAssetPath(project.thumbnail),
          fullImage: this.normalizeAssetPath(project.fullImage),
          gallery: (project.gallery ?? []).map((path) =>
            this.normalizeAssetPath(path)
          ),
          beforeAfter: project.beforeAfter
            ? {
                ...project.beforeAfter,
                before: this.normalizeAssetPath(project.beforeAfter.before),
                after: this.normalizeAssetPath(project.beforeAfter.after),
              }
            : undefined,
          instagramPosts: (project.instagramPosts ?? []).map((post) => ({
            handle: post.handle,
            images: post.images.map((path) => this.normalizeAssetPath(path)),
          })),
          liveDemoEnable: project.liveDemoEnable === 'true',
          githubUrlEnable: project.githubUrlEnable === 'true',
        }))
      )
    );
  }

  private normalizeAssetPath(path: string) {
    const normalized = path.replace('../assets', 'assets');

    if (!normalized.startsWith('assets/')) {
      return normalized;
    }

    return normalized
      .split('/')
      .map((segment, index) =>
        index === 0 ? segment : encodeURIComponent(segment)
      )
      .join('/');
  }
}
