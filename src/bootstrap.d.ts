// src/bootstrap.d.ts
declare module 'bootstrap' {
    export class Modal {
      constructor(element: Element);
      show(): void;
      hide(): void;
      static getInstance(element: Element): Modal | null;
    }
  }
  