import {
  Type,
  Component,
  NO_ERRORS_SCHEMA,
  DebugElement,
  ChangeDetectorRef,
  InjectionToken
} from "@angular/core";
import { TestBed, ComponentFixture } from "@angular/core/testing";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { BrowserDynamicTestingModule } from "@angular/platform-browser-dynamic/testing";
import { By } from "@angular/platform-browser";

expect.extend({
  toHaveText(received: Element, text) {
    const pass = received && received.textContent === text;
    if (pass) {
      return {
        message: () => `expected ${received.textContent} not to equal ${text}`,
        pass: true
      };
    } else {
      return {
        message: () => `expected ${received.textContent} to equal ${text}`,
        pass: false
      };
    }
  }
});

@Component({
  template: ""
})
export class DefaultHost {}

export function createTest<C>(Component: Type<C>, config = {}) {
  const defaultConfig = { imports: [], declarations: [], selfProviders: [] };
  let mergedConfig = Object.assign({}, defaultConfig, config);

  let hostFixture: ComponentFixture<DefaultHost> | null;
  let tested: DebugElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      // schemas: [shallow ? NO_ERRORS_SCHEMA : []],
      declarations: [DefaultHost, Component, mergedConfig.declarations],
      imports: [NoopAnimationsModule, mergedConfig.imports]
    });
  });

  afterEach(() => {
    hostFixture && hostFixture.destroy();
    tested = null;
    hostFixture = null;
  });

  return (template: string, options = {}) => {
    const defaultOptions = { detectChanges: true, inputs: {} };
    let merged = Object.assign({}, defaultOptions, options);

    TestBed.overrideComponent(DefaultHost, { set: { template } });

    TestBed.overrideComponent(Component, {
      set: {
        providers: [mergedConfig.selfProviders]
      }
    });
    hostFixture = TestBed.createComponent(DefaultHost);
    tested = hostFixture.debugElement.query(By.directive(Component));

    let host = {
      instance: hostFixture.componentInstance,
      debug: hostFixture.debugElement,
      element: hostFixture.nativeElement as Element,
      setInput(input, inputValue) {
        _setInput(input, inputValue, this.instance);
        this.debug.injector.get(ChangeDetectorRef).detectChanges();
      },
      query<R extends Element>(directiveOrSelector: any, options): R {
        return _getChild(this.debug, directiveOrSelector, options);
      }
    };

    let component = {
      instance: tested.componentInstance,
      debug: tested,
      element: tested.nativeElement as Element,
      setInput(input, inputValue) {
        _setInput(input, inputValue, this.instance);
        this.debug.injector.get(ChangeDetectorRef).detectChanges();
      },
      query<R extends Element>(directiveOrSelector: any, options): R {
        return _getChild(this.debug, directiveOrSelector, options);
      },
      get<T>(type: Type<T> | InjectionToken<T>, options = { self: false }): T {
        if (options.self) {
          return this.debug.injector.get(type) as T;
        }
        return TestBed.get(type);
      }
    };

    setInitialInputs(component.instance, merged.inputs);

    if (merged.detectChanges) {
      hostFixture.detectChanges();
    }

    return {
      host,
      component
    };
  };
}

function setInitialInputs(component, inputs) {
  for (let input in inputs) {
    component[input] = inputs[input];
  }
}

function _setInput(input, inputValue, component) {
  if (typeof input === "string") {
    component[input] = inputValue;
  } else {
    for (let p in input) {
      component[p] = input[p];
    }
  }
}

function _getChild<R>(
  debugElementRoot: DebugElement,
  directiveOrSelector: Type<any> | string,
  options: { read } = { read: undefined }
): R {
  let debugElement: DebugElement;

  if (typeof directiveOrSelector === "string") {
    debugElement = debugElementRoot.query(By.css(directiveOrSelector));
    return debugElement && debugElement.nativeElement;
  } else {
    debugElement = debugElementRoot.query(By.directive(directiveOrSelector));
  }

  if (!debugElement) {
    throw new Error(`Cannot find a debug element for ${directiveOrSelector}`);
  }

  if (options.read) {
    return debugElement.injector.get(options.read);
  }

  return debugElement.componentInstance;
}
