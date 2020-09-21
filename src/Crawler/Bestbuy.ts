import { CrawlerInterface } from "./CrawlerInterface";
import cheerio from "cheerio";
import { Product } from "../Model/Product";
import { Logger } from "../Logger";
import axios from "axios";

export class Bestbuy implements CrawlerInterface {
  private products: Product[] = [
    {
      name: "nVidia GeForce RTX 3080 FE",
      url: "https://www.bestbuy.com/site/6429440.p",
    },
    {
      name: "EVGA GeForce RTX 3080 XC3 ULTRA",
      url: "https://www.bestbuy.com/site/6432400.p",
    },
    {
      name: "EVGA GeForce RTX 3080 XC3 BLACK",
      url: "https://www.bestbuy.com/site/6432399.p",
    },
    {
      name: "MSI - Geforce RTX 3080 VENTUS 3X",
      url: "https://www.bestbuy.com/site/6430175.p",
    },
  ];

  getRetailerName(): string {
    return "Bestbuy";
  }

  async acquireStock(logger: Logger) {
    const products: Product[] = [];
    for await (const product of this.products) {
      try {
        const response = await axios.get(product.url);
        if (response.status !== 200) {
          logger.warning("Bestbuy Unavailable", { status: response.status });
          continue;
        }
        const $ = cheerio.load(response.data);
        product.retailer = this.getRetailerName();
        product.stock = $(".add-to-cart-button").first().text().trim();
        logger.debug(`Acquired stock from ${this.getRetailerName()}`, product);
        products.push(product);
      } catch (e) {
        logger.error(e.message, { url: product.url });
      }
    }
    logger.debug("Bestbuy Products:", products);
    return products;
  }
}
