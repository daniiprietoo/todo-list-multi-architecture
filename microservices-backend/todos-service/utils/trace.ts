export type TraceStep = {
  name: string;
  latency: number;
};

export class TraceContext {
  requestTrace: TraceStep[];
  constructor() {
    this.requestTrace = [];
  }

  addStep(name: string, latency: number) {
    this.requestTrace.unshift({ name, latency });
  }
}
