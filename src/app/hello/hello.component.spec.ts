import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { HelloComponent } from "./hello.component";
import { createTest } from "../lib/test";
import { HighlightDirective } from "../highlight.directive";
import { NoteService } from "../note.service";

declare global {
  namespace jest {
    interface Expect {
      toHaveText<T>(string): Matchers<T>;
    }
    interface Matchers<R> {
      toHaveText(string): R;
    }
  }
}

describe("HelloComponent", () => {
  let render = createTest<HelloComponent>(HelloComponent, {
    declarations: [HighlightDirective],
    selfProviders: [{ provide: NoteService, useValue: { name: "netanel" } }]
  });

  it("should create", () => {
    let { component, host } = render("<app-hello>Test</app-hello>", {
      inputs: { title: "Hello" }
    });

    console.log(component.get(NoteService));
    console.log(component.get(NoteService, { self: true }));

    expect(component.element.querySelector("p").textContent).toEqual("Hello");
    component.setInput("title", "changed");

    expect(
      component.query(HighlightDirective, { read: HighlightDirective })
        .appHighlight
    ).toEqual("changed");

    expect(component.query("p")).toHaveText("changed");
  });
});
