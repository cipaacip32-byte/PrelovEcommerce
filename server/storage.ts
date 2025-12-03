import {
  users,
  categories,
  products,
  cartItems,
  orders,
  orderItems,
  type User,
  type UpsertUser,
  type Category,
  type InsertCategory,
  type Product,
  type InsertProduct,
  type CartItem,
  type InsertCartItem,
  type Order,
  type InsertOrder,
  type OrderItem,
  type InsertOrderItem,
  type ProductWithSeller,
  type CartItemWithProduct,
  type OrderWithItems,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, sql } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Category operations
  getCategories(): Promise<Category[]>;
  getCategoryBySlug(slug: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  
  // Product operations
  getProducts(filters?: { categoryId?: number; sellerId?: string }): Promise<ProductWithSeller[]>;
  getProductById(id: number): Promise<ProductWithSeller | undefined>;
  getProductsBySeller(sellerId: string): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product | undefined>;
  deleteProduct(id: number): Promise<boolean>;
  incrementProductViews(id: number): Promise<void>;
  
  // Cart operations
  getCartItems(userId: string): Promise<CartItemWithProduct[]>;
  getCartItem(userId: string, productId: number): Promise<CartItem | undefined>;
  addToCart(item: InsertCartItem): Promise<CartItem>;
  updateCartItem(id: number, quantity: number): Promise<CartItem | undefined>;
  removeFromCart(id: number): Promise<boolean>;
  clearCart(userId: string): Promise<void>;
  
  // Order operations
  getOrders(userId: string): Promise<OrderWithItems[]>;
  getOrderById(id: number): Promise<OrderWithItems | undefined>;
  createOrder(order: InsertOrder, items: InsertOrderItem[]): Promise<Order>;
  updateOrderStatus(id: number, status: string): Promise<Order | undefined>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Category operations
  async getCategories(): Promise<Category[]> {
    return await db.select().from(categories);
  }

  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    const [category] = await db.select().from(categories).where(eq(categories.slug, slug));
    return category;
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const [newCategory] = await db.insert(categories).values(category).returning();
    return newCategory;
  }

  // Product operations
  async getProducts(filters?: { categoryId?: number; sellerId?: string }): Promise<ProductWithSeller[]> {
    let query = db
      .select({
        product: products,
        seller: users,
        category: categories,
      })
      .from(products)
      .leftJoin(users, eq(products.sellerId, users.id))
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .where(eq(products.isActive, true))
      .orderBy(desc(products.createdAt));

    const result = await query;
    
    return result
      .filter(row => {
        if (filters?.categoryId && row.product.categoryId !== filters.categoryId) return false;
        if (filters?.sellerId && row.product.sellerId !== filters.sellerId) return false;
        return true;
      })
      .map(row => ({
        ...row.product,
        seller: row.seller!,
        category: row.category || undefined,
      }));
  }

  async getProductById(id: number): Promise<ProductWithSeller | undefined> {
    const result = await db
      .select({
        product: products,
        seller: users,
        category: categories,
      })
      .from(products)
      .leftJoin(users, eq(products.sellerId, users.id))
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .where(eq(products.id, id));

    if (result.length === 0) return undefined;

    const row = result[0];
    return {
      ...row.product,
      seller: row.seller!,
      category: row.category || undefined,
    };
  }

  async getProductsBySeller(sellerId: string): Promise<Product[]> {
    return await db
      .select()
      .from(products)
      .where(eq(products.sellerId, sellerId))
      .orderBy(desc(products.createdAt));
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const [newProduct] = await db.insert(products).values(product).returning();
    return newProduct;
  }

  async updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product | undefined> {
    const [updated] = await db
      .update(products)
      .set({ ...product, updatedAt: new Date() })
      .where(eq(products.id, id))
      .returning();
    return updated;
  }

  async deleteProduct(id: number): Promise<boolean> {
    const result = await db.delete(products).where(eq(products.id, id));
    return true;
  }

  async incrementProductViews(id: number): Promise<void> {
    await db
      .update(products)
      .set({ views: sql`${products.views} + 1` })
      .where(eq(products.id, id));
  }

  // Cart operations
  async getCartItems(userId: string): Promise<CartItemWithProduct[]> {
    const result = await db
      .select({
        cartItem: cartItems,
        product: products,
        seller: users,
      })
      .from(cartItems)
      .innerJoin(products, eq(cartItems.productId, products.id))
      .leftJoin(users, eq(products.sellerId, users.id))
      .where(eq(cartItems.userId, userId));

    return result.map(row => ({
      ...row.cartItem,
      product: {
        ...row.product,
        seller: row.seller!,
      },
    }));
  }

  async getCartItem(userId: string, productId: number): Promise<CartItem | undefined> {
    const [item] = await db
      .select()
      .from(cartItems)
      .where(and(eq(cartItems.userId, userId), eq(cartItems.productId, productId)));
    return item;
  }

  async addToCart(item: InsertCartItem): Promise<CartItem> {
    const existing = await this.getCartItem(item.userId, item.productId);
    if (existing) {
      const [updated] = await db
        .update(cartItems)
        .set({ quantity: existing.quantity + (item.quantity || 1) })
        .where(eq(cartItems.id, existing.id))
        .returning();
      return updated;
    }
    const [newItem] = await db.insert(cartItems).values(item).returning();
    return newItem;
  }

  async updateCartItem(id: number, quantity: number): Promise<CartItem | undefined> {
    const [updated] = await db
      .update(cartItems)
      .set({ quantity })
      .where(eq(cartItems.id, id))
      .returning();
    return updated;
  }

  async removeFromCart(id: number): Promise<boolean> {
    await db.delete(cartItems).where(eq(cartItems.id, id));
    return true;
  }

  async clearCart(userId: string): Promise<void> {
    await db.delete(cartItems).where(eq(cartItems.userId, userId));
  }

  // Order operations
  async getOrders(userId: string): Promise<OrderWithItems[]> {
    const ordersResult = await db
      .select()
      .from(orders)
      .where(eq(orders.buyerId, userId))
      .orderBy(desc(orders.createdAt));

    const ordersWithItems: OrderWithItems[] = [];
    for (const order of ordersResult) {
      const items = await db
        .select({
          orderItem: orderItems,
          product: products,
        })
        .from(orderItems)
        .leftJoin(products, eq(orderItems.productId, products.id))
        .where(eq(orderItems.orderId, order.id));

      ordersWithItems.push({
        ...order,
        items: items.map(row => ({
          ...row.orderItem,
          product: row.product!,
        })),
      });
    }

    return ordersWithItems;
  }

  async getOrderById(id: number): Promise<OrderWithItems | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    if (!order) return undefined;

    const items = await db
      .select({
        orderItem: orderItems,
        product: products,
      })
      .from(orderItems)
      .leftJoin(products, eq(orderItems.productId, products.id))
      .where(eq(orderItems.orderId, id));

    return {
      ...order,
      items: items.map(row => ({
        ...row.orderItem,
        product: row.product!,
      })),
    };
  }

  async createOrder(order: InsertOrder, items: InsertOrderItem[]): Promise<Order> {
    const [newOrder] = await db.insert(orders).values(order).returning();
    
    for (const item of items) {
      await db.insert(orderItems).values({
        ...item,
        orderId: newOrder.id,
      });
      
      // Update product stock and sold count
      await db
        .update(products)
        .set({
          stock: sql`${products.stock} - ${item.quantity}`,
          soldCount: sql`${products.soldCount} + ${item.quantity}`,
        })
        .where(eq(products.id, item.productId));
    }

    return newOrder;
  }

  async updateOrderStatus(id: number, status: string): Promise<Order | undefined> {
    const [updated] = await db
      .update(orders)
      .set({ status, updatedAt: new Date() })
      .where(eq(orders.id, id))
      .returning();
    return updated;
  }
}

export const storage = new DatabaseStorage();
