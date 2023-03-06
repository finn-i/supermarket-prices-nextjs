import { DatedPrice, Product } from '../typings';

// AWS Cloudfront CDN url base
export const transparentImageUrlBase: string = 'https://d1hhwouzawkav1.cloudfront.net/';

// Enums
export enum PriceTrend {
  Increased,
  Decreased,
  Same,
}
export enum Store {
  Countdown,
  Paknsave,
  Warehouse,
  CountdownPaknSave,
  CountdownWarehouse,
  PaknsaveWarehouse,
  Any,
}
export enum OrderByMode {
  Latest,
  Oldest,
  PriceLowest,
  PriceHighest,
  None,
}
export enum PriceHistoryLimit {
  Any,
  TwoOrMore,
  FourOrMore,
}

// Removes undesired fields that CosmosDB creates
export function cleanProductFields(document: Product): Product {
  let { id, name, currentPrice, size, sourceSite, priceHistory, category, lastUpdated } = document;
  if (!category) category = ['No Category'];
  if (!lastUpdated) lastUpdated = '';
  const cleanedProduct: Product = {
    id,
    name,
    currentPrice,
    size,
    sourceSite,
    priceHistory,
    category,
    lastUpdated,
  };
  return cleanedProduct;
}

export function sortProductsByName(products: Product[]): Product[] {
  return products.sort((a, b) => {
    if (a.name < b.name) return -1;
    if (a.name > b.name) return 1;
    return 0;
  });
}

export function sortProductsByDate(products: Product[]): Product[] {
  return products.sort((a, b) => {
    const dateA = new Date(a.priceHistory[a.priceHistory.length - 1].date);
    const dateB = new Date(b.priceHistory[b.priceHistory.length - 1].date);
    if (dateA > dateB) return -1;
    if (dateA < dateB) return 1;
    return 0;
  });
}

// Adds $ symbol and 2 decimal points if applicable
export function printPrice(price: number): string {
  // If a whole integer such as 8, return without any decimals - $8
  if (price.toString() === parseInt(price.toString()).toString()) {
    return '$' + price;
    // Else return with decimals extended - 8.4 becomes $8.40
  } else {
    return '$' + price.toFixed(2);
  }
}

// Takes a DatedPrice[] object and returns if price is trending down
export function priceTrend(priceHistory: DatedPrice[]): PriceTrend {
  if (priceHistory.length > 1) {
    const latestPrice = priceHistory[priceHistory.length - 1].price;
    const olderPrice = priceHistory[priceHistory.length - 2].price;
    if (latestPrice < olderPrice) return PriceTrend.Decreased;
    else return PriceTrend.Increased;
  } else return PriceTrend.Same;
}
