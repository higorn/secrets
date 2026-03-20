import { setupZoneTestEnv } from 'jest-preset-angular/setup-env/zone';

setupZoneTestEnv();

/** Jasmine-style `spyOn(...).and.callFake(...)` used by legacy specs */
function jasmineSpyOn(object: object, method: string) {
  return {
    and: {
      callFake: (fn: (...args: unknown[]) => unknown) =>
        jest.spyOn(object, method as never).mockImplementation(fn as never),
    },
  };
}
(globalThis as unknown as { spyOn: typeof jasmineSpyOn }).spyOn = jasmineSpyOn;

Object.defineProperty(window, 'CSS', { value: null });
Object.defineProperty(window, 'getComputedStyle', {
  value: () => ({
    display: 'none',
    appearance: ['-webkit-appearance'],
  }),
});

Object.defineProperty(document, 'doctype', {
  value: '<!DOCTYPE html>',
});
Object.defineProperty(document.body.style, 'transform', {
  value: () => ({
    enumerable: true,
    configurable: true,
  }),
});
