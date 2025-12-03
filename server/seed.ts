import { db } from "./db";
import { categories, products, users } from "@shared/schema";
import { sql } from "drizzle-orm";

const categoryData = [
  { name: "Elektronik", slug: "elektronik", icon: "Smartphone", description: "Gadget, laptop, dan perangkat elektronik lainnya" },
  { name: "Fashion", slug: "fashion", icon: "Shirt", description: "Pakaian, sepatu, dan aksesoris" },
  { name: "Furniture", slug: "furniture", icon: "Sofa", description: "Perabotan rumah tangga" },
  { name: "Hobi & Koleksi", slug: "hobi-koleksi", icon: "Gamepad2", description: "Barang koleksi dan hobi" },
  { name: "Buku", slug: "buku", icon: "BookOpen", description: "Buku, majalah, dan komik" },
  { name: "Otomotif", slug: "otomotif", icon: "Car", description: "Aksesoris dan suku cadang kendaraan" },
  { name: "Perlengkapan Bayi", slug: "perlengkapan-bayi", icon: "Baby", description: "Perlengkapan dan mainan bayi" },
  { name: "Olahraga", slug: "olahraga", icon: "Dumbbell", description: "Peralatan dan pakaian olahraga" },
  { name: "Kecantikan", slug: "kecantikan", icon: "Sparkles", description: "Skincare, makeup, dan parfum" },
];

async function seed() {
  console.log("Seeding database...");

  // Check if categories exist
  const existingCategories = await db.select().from(categories);
  
  if (existingCategories.length === 0) {
    console.log("Inserting categories...");
    for (const cat of categoryData) {
      await db.insert(categories).values(cat);
    }
    console.log("Categories inserted successfully!");
  } else {
    console.log("Categories already exist, skipping...");
  }

  // Create demo user if not exists
  const demoUserId = "demo-seller-001";
  const existingUser = await db.select().from(users).where(sql`${users.id} = ${demoUserId}`);
  
  if (existingUser.length === 0) {
    console.log("Creating demo seller...");
    await db.insert(users).values({
      id: demoUserId,
      email: "demo@prelovin.id",
      firstName: "Toko",
      lastName: "Demo",
      profileImageUrl: "https://api.dicebear.com/7.x/initials/svg?seed=TD",
      city: "Jakarta",
    });
    console.log("Demo seller created!");
  }

  // Check if products exist
  const existingProducts = await db.select().from(products);
  
  if (existingProducts.length === 0) {
    console.log("Inserting sample products...");
    
    const sampleProducts = [
      {
        sellerId: demoUserId,
        categoryId: 1, // Elektronik
        name: "iPhone 13 Pro 256GB - Mulus Seperti Baru",
        description: "iPhone 13 Pro warna Graphite, kondisi 98%. Battery health 92%. Fullset box, charger, dan case. Garansi inter, sudah off. No minus, layar mulus tanpa gores. Bisa COD area Jakarta.",
        price: "11500000",
        originalPrice: "15999000",
        condition: "Seperti Baru",
        images: ["https://images.unsplash.com/photo-1632661674596-df8be070a5c5?w=500&h=500&fit=crop"],
        stock: 1,
        location: "Jakarta Selatan",
        isActive: true,
      },
      {
        sellerId: demoUserId,
        categoryId: 1,
        name: "MacBook Pro M1 2020 8GB/256GB",
        description: "MacBook Pro M1 chip, 8GB RAM, 256GB SSD. Cycle count rendah, battery health 95%. Fullset dengan dus dan charger original. Perfect untuk coding atau design.",
        price: "13500000",
        originalPrice: "18499000",
        condition: "Seperti Baru",
        images: ["https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=500&h=500&fit=crop"],
        stock: 1,
        location: "Jakarta Pusat",
        isActive: true,
      },
      {
        sellerId: demoUserId,
        categoryId: 2, // Fashion
        name: "Jaket Kulit Vintage - Genuine Leather",
        description: "Jaket kulit asli vintage style. Size L (fit M-L). Warna coklat tua. Kondisi sangat bagus, tidak ada sobek atau cacat. Bahan tebal dan berkualitas.",
        price: "850000",
        originalPrice: "1500000",
        condition: "Bagus",
        images: ["https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&h=500&fit=crop"],
        stock: 1,
        location: "Bandung",
        isActive: true,
      },
      {
        sellerId: demoUserId,
        categoryId: 2,
        name: "Sneakers Nike Air Max 90 Original",
        description: "Nike Air Max 90 authentic, size 42. Warna white/black. Pemakaian 3 bulan, kondisi 90%. Midsole masih putih. Lengkap dengan box.",
        price: "950000",
        originalPrice: "1899000",
        condition: "Bagus",
        images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop"],
        stock: 1,
        location: "Surabaya",
        isActive: true,
      },
      {
        sellerId: demoUserId,
        categoryId: 3, // Furniture
        name: "Meja Kerja Minimalis Kayu Jati",
        description: "Meja kerja kayu jati solid 120x60cm. Tinggi 75cm. Desain minimalis modern. Ada laci penyimpanan. Cocok untuk WFH atau ruang belajar.",
        price: "1200000",
        originalPrice: "2000000",
        condition: "Bagus",
        images: ["https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=500&h=500&fit=crop"],
        stock: 1,
        location: "Yogyakarta",
        isActive: true,
      },
      {
        sellerId: demoUserId,
        categoryId: 3,
        name: "Kursi Gaming RGB - Ergonomic Chair",
        description: "Kursi gaming dengan sandaran kepala dan lumbar. Bahan PU leather. Armrest adjustable. Reclining hingga 180 derajat. Sudah pakai 6 bulan, kondisi 85%.",
        price: "1500000",
        originalPrice: "2800000",
        condition: "Bagus",
        images: ["https://images.unsplash.com/photo-1612372606404-0ab33e7187ee?w=500&h=500&fit=crop"],
        stock: 1,
        location: "Bekasi",
        isActive: true,
      },
      {
        sellerId: demoUserId,
        categoryId: 4, // Hobi & Koleksi
        name: "Kamera Canon EOS 80D + Lensa 18-135mm",
        description: "Canon 80D body dengan lensa kit 18-135mm IS USM. Shutter count 15rb. Layar touchscreen vari-angle. Kondisi mulus terawat. Fullset dengan tas dan memory 32GB.",
        price: "9500000",
        originalPrice: "16000000",
        condition: "Bagus",
        images: ["https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&h=500&fit=crop"],
        stock: 1,
        location: "Tangerang",
        isActive: true,
      },
      {
        sellerId: demoUserId,
        categoryId: 5, // Buku
        name: "Koleksi Buku Harry Potter Lengkap 1-7 (Hardcover)",
        description: "Set lengkap Harry Potter edisi hardcover bahasa Indonesia. Kondisi 95%, jarang dibaca. Sampul tidak ada sobek, halaman bersih tanpa coretan.",
        price: "750000",
        originalPrice: "1400000",
        condition: "Seperti Baru",
        images: ["https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500&h=500&fit=crop"],
        stock: 1,
        location: "Depok",
        isActive: true,
      },
      {
        sellerId: demoUserId,
        categoryId: 8, // Olahraga
        name: "Sepeda Lipat Pacific Noris 20 inch",
        description: "Sepeda lipat Pacific Noris ukuran 20 inch. 7 speed Shimano. Frame alloy ringan. Rem disc brake. Pemakaian setahun, servis rutin. Ban baru diganti.",
        price: "2200000",
        originalPrice: "3500000",
        condition: "Bagus",
        images: ["https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?w=500&h=500&fit=crop"],
        stock: 1,
        location: "Jakarta Barat",
        isActive: true,
      },
      {
        sellerId: demoUserId,
        categoryId: 7, // Perlengkapan Bayi
        name: "Stroller Bayi Joie Chrome DLX",
        description: "Stroller Joie Chrome DLX, bisa rebahan 180 derajat. Roda besar empuk. Ada kanopi UV protection. Pemakaian 8 bulan, kondisi 90%. Lengkap dengan rain cover.",
        price: "2800000",
        originalPrice: "5500000",
        condition: "Bagus",
        images: ["https://images.unsplash.com/photo-1591088398332-8a7791972843?w=500&h=500&fit=crop"],
        stock: 1,
        location: "Bogor",
        isActive: true,
      },
    ];

    for (const product of sampleProducts) {
      await db.insert(products).values(product);
    }
    console.log("Sample products inserted successfully!");
  } else {
    console.log("Products already exist, skipping...");
  }

  console.log("Seeding completed!");
}

seed()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Seeding failed:", error);
    process.exit(1);
  });
