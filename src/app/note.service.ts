import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class NoteService {
  num = Math.random();
  constructor() {}
}
