import {
  Component,
  OnInit,
  Input,
  ChangeDetectionStrategy
} from "@angular/core";
import { NoteService } from "../note.service";

@Component({
  selector: "app-hello",
  templateUrl: "./hello.component.html",
  providers: [NoteService],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ["./hello.component.css"]
})
export class HelloComponent implements OnInit {
  @Input()
  title: string;
  constructor(private c: NoteService) {}

  ngOnInit() {}
}
