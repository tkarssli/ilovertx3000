import {Product} from '../Model/Product';
import {Logger} from '../Logger';

export interface CrawlerInterface {
  getRetailerName(): string;

  acquireStock(logger: Logger): Promise<Product[]>;
}
