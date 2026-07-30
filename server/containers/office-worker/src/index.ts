import { Container } from "@cloudflare/containers";

export class OfficeWorker extends Container {
  async fetch(request: Request) {
    return new Response("OfficeWorker container is running!");
  }
}

export default {
  async fetch(request: Request, env: any) {
    return new Response("FileKit Cloudflare Containers Worker");
  }
};
