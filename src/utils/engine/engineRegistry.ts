import { CompressionEngine } from "./types";
import { MockCompressionEngine } from "./mockEngine";

class EngineRegistry {
  private engines: Map<string, CompressionEngine> = new Map();

  register(engine: CompressionEngine) {
    this.engines.set(engine.id, engine);
  }

  getEngine(id: string): CompressionEngine {
    const isProduction = typeof process !== "undefined" && process.env && process.env.NODE_ENV === "production";
    
    // Guard against mock engine execution in production
    if (id === "mock-wasm-retained-engine") {
      if (isProduction) {
        throw new Error("Security Violation: Mock engine execution is prohibited in production environments.");
      }
      return new MockCompressionEngine();
    }

    const engine = this.engines.get(id);
    if (!engine) {
      throw new Error(`Execution Error: Compression engine "${id}" is not registered in the system.`);
    }

    return engine;
  }
}

export const engineRegistry = new EngineRegistry();
export default engineRegistry;
