import { CrawlerInterface } from "./Crawler/CrawlerInterface";
import { Product } from "./Model/Product";
import { Logger } from "./Logger";
import { NotificationInterface } from "./Notification/NotificationInterface";

export class Bot {
  private stock: Product[] = [];

  constructor(
    private readonly delay: number,
    private readonly crawler: CrawlerInterface[],
    private readonly notifications: NotificationInterface[],
    private readonly logger: Logger
  ) {}

  async start() {
    this.logger.info(
      `Starting ilovertx3000 with ${
        this.crawler.length
      } crawler: ${this.crawler.map((c) => c.constructor.name).join(", ")}`
    );

    if (this.crawler.length === 0) {
      this.logger.info("Nothing to do here...");
      return;
    }

    // noinspection InfiniteLoopJS
    while (true) {
      const promises = [] as Promise<Product[]>[];

      for await (const crawler of this.crawler) {
        promises.push(
          new Promise(async (resolve, reject) => {
            console.log("Checking: " + crawler.getRetailerName());
            const stock = await crawler.acquireStock(this.logger);
            stock.forEach((product) => {
              const existing = this.stock.find(
                (p) =>
                  p.retailer === product.retailer && p.name === product.name
              );
              if (!existing) {
                this.stock.push({ ...product });
                resolve();
                return;
              }
              if (
                product.stock !== existing.stock ||
                product.retailer === "Bestbuy"
              ) {
                this.handleStockChange(product, existing);
                existing.stock = product.stock;
              }
              resolve();
            });
          })
        );
      }
      await Promise.all(promises);
      this.logger.debug("Sleeping");
      await this.sleep(this.delay);
    }
  }

  private handleStockChange(product: Product, previous: Product) {
    this.notifications.forEach((notification) => {
      notification.notify(
        `${product.retailer}: Stock changed from "${previous.stock}" to "${product.stock}". ${product.url}`,
        this.logger
      );
    });
  }

  private async sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
