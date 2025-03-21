interface Category {
  name: string;
}
interface Product {
  id?: number;
  name: string;
  description: string;
  images: string[] | string ; 
  price: string;
  number: string;
  status: string;
  createdAt?: string;
  updatedAt?: string;
}


interface Order {
  id?: number;
  products: Array<{
    productId: number;
    quantity: number;
    price: string;
  }>;
  total: string;
  status: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  wilaya: string;
  commune: string;
  createdAt?: string;
  updatedAt?: string;
}

const openDatabase = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("MyDatabase", 1);

    request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains("category")) {
        db.createObjectStore("category", { keyPath: "name" });
      }
      if (!db.objectStoreNames.contains("products")) {
        const productStore = db.createObjectStore("products", {
          keyPath: "id",
          autoIncrement: true,
        });
        productStore.createIndex("name", "name", { unique: true });
      }
      if (!db.objectStoreNames.contains("orders")) {
        const orderStore = db.createObjectStore("orders", {
          keyPath: "id",
          autoIncrement: true,
        });
        orderStore.createIndex("status", "status", { unique: false });
      }
    };

    request.onsuccess = (event: Event) => {
      resolve((event.target as IDBOpenDBRequest).result);
    };

    request.onerror = (event: Event) => {
      reject(
        `Error opening database: ${(event.target as IDBOpenDBRequest).error}`,
      );
    };
  });
};

export const addCategory = async (category: Category): Promise<void> => {
  const db = await openDatabase();
  const transaction = db.transaction("category", "readwrite");
  const store = transaction.objectStore("category");

  const request = store.add(category);

  request.onsuccess = () => {
    console.log("Category added successfully");
  };

  request.onerror = (event: Event) => {
    console.error("Error adding category:", (event.target as IDBRequest).error);
  };
};

export const getCategory = async (name: string): Promise<Category | null> => {
  const db = await openDatabase();
  const transaction = db.transaction("category", "readonly");
  const store = transaction.objectStore("category");

  return new Promise((resolve, reject) => {
    const request = store.get(name);

    request.onsuccess = () => {
      resolve(request.result || null);
    };

    request.onerror = (event: Event) => {
      reject(
        `Error retrieving category: ${(event.target as IDBRequest).error}`,
      );
    };
  });
};

export const updateCategory = async (
  name: string,
  updatedData: Partial<Category>,
): Promise<void> => {
  const db = await openDatabase();
  const transaction = db.transaction("category", "readwrite");
  const store = transaction.objectStore("category");

  const request = store.get(name);

  request.onsuccess = () => {
    const category: Category = request.result;
    if (category) {
      Object.assign(category, updatedData);
      const updateRequest = store.put(category);

      updateRequest.onsuccess = () => {
        console.log("Category updated successfully");
      };

      updateRequest.onerror = (event: Event) => {
        console.error(
          "Error updating category:",
          (event.target as IDBRequest).error,
        );
      };
    } else {
      console.log("Category not found");
    }
  };

  request.onerror = (event: Event) => {
    console.error(
      "Error fetching category:",
      (event.target as IDBRequest).error,
    );
  };
};

export const deleteCategory = async (name: string): Promise<void> => {
  const db = await openDatabase();
  const transaction = db.transaction("category", "readwrite");
  const store = transaction.objectStore("category");

  const request = store.delete(name);

  request.onsuccess = () => {
    console.log("Category deleted successfully");
  };

  request.onerror = (event: Event) => {
    console.error(
      "Error deleting category:",
      (event.target as IDBRequest).error,
    );
  };
};

export const getAllCategories = async (): Promise<Category[]> => {
  const db = await openDatabase();
  const transaction = db.transaction("category", "readonly");
  const store = transaction.objectStore("category");

  return new Promise((resolve, reject) => {
    const request = store.getAll();

    request.onsuccess = () => {
      resolve(request.result || []);
    };

    request.onerror = (event: Event) => {
      reject(
        `Error retrieving categories: ${(event.target as IDBRequest).error}`,
      );
    };
  });
};

export const addProduct = async (product: Product): Promise<void> => {
  const db = await openDatabase();
  const transaction = db.transaction("products", "readwrite");
  const store = transaction.objectStore("products");

  const newProduct = {
    ...product,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const request = store.add(newProduct);

  request.onsuccess = () => {
    console.log("Product added successfully");
  };

  request.onerror = (event: Event) => {
    console.error("Error adding product:", (event.target as IDBRequest).error);
  };
};

export const getProduct = async (id: number): Promise<Product | null> => {
  const db = await openDatabase();
  const transaction = db.transaction("products", "readonly");
  const store = transaction.objectStore("products");

  return new Promise((resolve, reject) => {
    const request = store.get(id);

    request.onsuccess = () => {
      resolve(request.result || null);
    };

    request.onerror = (event: Event) => {
      reject(`Error retrieving product: ${(event.target as IDBRequest).error}`);
    };
  });
};

export const updateProduct = async (
  id: number,
  updatedData: Partial<Product>,
): Promise<void> => {
  const db = await openDatabase();
  const transaction = db.transaction("products", "readwrite");
  const store = transaction.objectStore("products");

  const request = store.get(id);

  request.onsuccess = () => {
    const product: Product = request.result;
    if (product) {
      Object.assign(product, updatedData);
      product.updatedAt = new Date().toISOString();

      const updateRequest = store.put(product);

      updateRequest.onsuccess = () => {
        console.log("Product updated successfully");
      };

      updateRequest.onerror = (event: Event) => {
        console.error(
          "Error updating product:",
          (event.target as IDBRequest).error,
        );
      };
    } else {
      console.log("Product not found");
    }
  };

  request.onerror = (event: Event) => {
    console.error(
      "Error fetching product:",
      (event.target as IDBRequest).error,
    );
  };
};

export const deleteProduct = async (id: number): Promise<void> => {
  const db = await openDatabase();
  const transaction = db.transaction("products", "readwrite");
  const store = transaction.objectStore("products");

  const request = store.delete(id);

  request.onsuccess = () => {
    console.log("Product deleted successfully");
  };

  request.onerror = (event: Event) => {
    console.error(
      "Error deleting product:",
      (event.target as IDBRequest).error,
    );
  };
};

export const getAllProducts = async (): Promise<Product[]> => {
  const db = await openDatabase();
  const transaction = db.transaction("products", "readonly");
  const store = transaction.objectStore("products");

  return new Promise((resolve, reject) => {
    const request = store.getAll();

    request.onsuccess = () => {
      resolve(request.result || []);
    };

    request.onerror = (event: Event) => {
      reject(
        `Error retrieving products: ${(event.target as IDBRequest).error}`,
      );
    };
  });
};

export const getProductByName = async (
  name: string,
): Promise<Product | null> => {
  const db = await openDatabase();
  const transaction = db.transaction("products", "readonly");
  const store = transaction.objectStore("products");
  const index = store.index("name");

  return new Promise((resolve, reject) => {
    const request = index.get(name);

    request.onsuccess = () => {
      resolve(request.result || null);
    };

    request.onerror = (event: Event) => {
      reject(`Error retrieving product: ${(event.target as IDBRequest).error}`);
    };
  });
};

export const addOrder = async (order: Order): Promise<void> => {
  const db = await openDatabase();
  const transaction = db.transaction("orders", "readwrite");
  const store = transaction.objectStore("orders");

  const newOrder = {
    ...order,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const request = store.add(newOrder);

  request.onsuccess = () => {
    console.log("Order added successfully");
  };

  request.onerror = (event: Event) => {
    console.error("Error adding order:", (event.target as IDBRequest).error);
  };
};

export const getOrder = async (id: number): Promise<Order | null> => {
  const db = await openDatabase();
  const transaction = db.transaction("orders", "readonly");
  const store = transaction.objectStore("orders");

  return new Promise((resolve, reject) => {
    const request = store.get(id);

    request.onsuccess = () => {
      resolve(request.result || null);
    };

    request.onerror = (event: Event) => {
      reject(`Error retrieving order: ${(event.target as IDBRequest).error}`);
    };
  });
};

export const updateOrder = async (
  id: number,
  updatedData: Partial<Order>,
): Promise<void> => {
  const db = await openDatabase();
  const transaction = db.transaction("orders", "readwrite");
  const store = transaction.objectStore("orders");

  const request = store.get(id);

  request.onsuccess = () => {
    const order: Order = request.result;
    if (order) {
      Object.assign(order, updatedData);
      order.updatedAt = new Date().toISOString();

      const updateRequest = store.put(order);

      updateRequest.onsuccess = () => {
        console.log("Order updated successfully");
      };

      updateRequest.onerror = (event: Event) => {
        console.error(
          "Error updating order:",
          (event.target as IDBRequest).error,
        );
      };
    } else {
      console.log("Order not found");
    }
  };

  request.onerror = (event: Event) => {
    console.error("Error fetching order:", (event.target as IDBRequest).error);
  };
};

export const deleteOrder = async (id: number): Promise<void> => {
  const db = await openDatabase();
  const transaction = db.transaction("orders", "readwrite");
  const store = transaction.objectStore("orders");

  const request = store.delete(id);

  request.onsuccess = () => {
    console.log("Order deleted successfully");
  };

  request.onerror = (event: Event) => {
    console.error("Error deleting order:", (event.target as IDBRequest).error);
  };
};

export const getAllOrders = async (): Promise<Order[]> => {
  const db = await openDatabase();
  const transaction = db.transaction("orders", "readonly");
  const store = transaction.objectStore("orders");

  return new Promise((resolve, reject) => {
    const request = store.getAll();

    request.onsuccess = () => {
      resolve(request.result || []);
    };

    request.onerror = (event: Event) => {
      reject(`Error retrieving orders: ${(event.target as IDBRequest).error}`);
    };
  });
};

export const getOrdersByStatus = async (status: string): Promise<Order[]> => {
  const db = await openDatabase();
  const transaction = db.transaction("orders", "readonly");
  const store = transaction.objectStore("orders");
  const index = store.index("status");

  return new Promise((resolve, reject) => {
    const request = index.getAll(status);

    request.onsuccess = () => {
      resolve(request.result || []);
    };

    request.onerror = (event: Event) => {
      reject(
        `Error retrieving orders by status: ${(event.target as IDBRequest).error}`,
      );
    };
  });
};