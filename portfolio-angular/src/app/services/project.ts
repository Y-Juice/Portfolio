import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

export interface Project {
  id: string;
  title: string;
  shortDescription: string;
  thumbnail: string;
  fullImage: string;
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
    Omit<Project, 'liveDemoEnable' | 'githubUrlEnable'> & {
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
          thumbnail: this.normalizeAssetPath(project.thumbnail),
          fullImage: this.normalizeAssetPath(project.fullImage),
          liveDemoEnable: project.liveDemoEnable === 'true',
          githubUrlEnable: project.githubUrlEnable === 'true',
        }))
      )
    );
  }

  private normalizeAssetPath(path: string) {
    return path.replace('../assets', 'assets');
  }
}
