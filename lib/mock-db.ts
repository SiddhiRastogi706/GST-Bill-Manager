// Shared mock database for authentication
// In production, replace this with MongoDB or another database

export interface User {
  id: string
  name: string
  email: string
  phone: string
  businessName: string
  password: string
  role: "user" | "admin"
  createdAt: Date
}

export interface Client {
  id: string
  name: string
  email: string
  phone: string
  gstin: string
  address: string
  city: string
  state: string
  createdAt: Date
}

export interface Product {
  id: string
  name: string
  hsn: string
  description: string
  price: number
  taxRate: number
  stock: number
  createdAt: Date
}

export interface Invoice {
  id: string
  invoiceNumber: string
  clientId: string
  clientName: string
  amount: number
  gst: number
  total: number
  date: string
  status: "draft" | "sent" | "paid"
  lineItems: any[]
  createdAt: Date
}

export const mockDatabase = {
  users: [
    {
      id: "1",
      name: "Demo User",
      email: "demo@example.com",
      phone: "+91 98765 43210",
      businessName: "Demo Business",
      password: "password123",
      role: "user" as const,
      createdAt: new Date(),
    },
  ] as User[],
  clients: [
    {
      id: "1",
      name: "ABC Corporation",
      email: "contact@abc.com",
      phone: "+91 98765 43210",
      gstin: "27AABCT1234H1Z0",
      address: "123 Business Street",
      city: "Mumbai",
      state: "Maharashtra",
      createdAt: new Date(),
    },
    {
      id: "2",
      name: "XYZ Industries",
      email: "info@xyz.com",
      phone: "+91 87654 32109",
      gstin: "27AABCU5678H1Z0",
      address: "456 Industrial Area",
      city: "Pune",
      state: "Maharashtra",
      createdAt: new Date(),
    },
  ] as Client[],
  products: [
    {
      id: "1",
      name: "Consulting Services",
      hsn: "9982",
      description: "Professional consulting services",
      price: 5000,
      taxRate: 18,
      stock: 100,
      createdAt: new Date(),
    },
    {
      id: "2",
      name: "Software License",
      hsn: "4721",
      description: "Annual software license",
      price: 10000,
      taxRate: 18,
      stock: 50,
      createdAt: new Date(),
    },
  ] as Product[],
  invoices: [
    {
      id: "1",
      invoiceNumber: "INV-001",
      clientId: "1",
      clientName: "ABC Corporation",
      amount: 10000,
      gst: 1800,
      total: 11800,
      date: "2025-01-15",
      status: "paid" as const,
      lineItems: [],
      createdAt: new Date(),
    },
  ] as Invoice[],
}

// User functions
export function findUserByEmail(email: string) {
  return mockDatabase.users.find((u) => u.email === email)
}

export function addUser(user: User) {
  mockDatabase.users.push(user)
  return user
}

export function getUserById(id: string) {
  return mockDatabase.users.find((u) => u.id === id)
}

export function getAllClients() {
  return mockDatabase.clients
}

export function getClientById(id: string) {
  return mockDatabase.clients.find((c) => c.id === id)
}

export function addClient(client: Client) {
  mockDatabase.clients.push(client)
  return client
}

export function updateClient(id: string, updates: Partial<Client>) {
  const index = mockDatabase.clients.findIndex((c) => c.id === id)
  if (index !== -1) {
    mockDatabase.clients[index] = { ...mockDatabase.clients[index], ...updates }
    return mockDatabase.clients[index]
  }
  return null
}

export function deleteClient(id: string) {
  const index = mockDatabase.clients.findIndex((c) => c.id === id)
  if (index !== -1) {
    mockDatabase.clients.splice(index, 1)
    return true
  }
  return false
}

export function getAllProducts() {
  return mockDatabase.products
}

export function getProductById(id: string) {
  return mockDatabase.products.find((p) => p.id === id)
}

export function addProduct(product: Product) {
  mockDatabase.products.push(product)
  return product
}

export function updateProduct(id: string, updates: Partial<Product>) {
  const index = mockDatabase.products.findIndex((p) => p.id === id)
  if (index !== -1) {
    mockDatabase.products[index] = { ...mockDatabase.products[index], ...updates }
    return mockDatabase.products[index]
  }
  return null
}

export function deleteProduct(id: string) {
  const index = mockDatabase.products.findIndex((p) => p.id === id)
  if (index !== -1) {
    mockDatabase.products.splice(index, 1)
    return true
  }
  return false
}

export function getAllInvoices() {
  return mockDatabase.invoices
}

export function getInvoiceById(id: string) {
  return mockDatabase.invoices.find((i) => i.id === id)
}

export function addInvoice(invoice: Invoice) {
  mockDatabase.invoices.push(invoice)
  return invoice
}

export function updateInvoice(id: string, updates: Partial<Invoice>) {
  const index = mockDatabase.invoices.findIndex((i) => i.id === id)
  if (index !== -1) {
    mockDatabase.invoices[index] = { ...mockDatabase.invoices[index], ...updates }
    return mockDatabase.invoices[index]
  }
  return null
}

export function deleteInvoice(id: string) {
  const index = mockDatabase.invoices.findIndex((i) => i.id === id)
  if (index !== -1) {
    mockDatabase.invoices.splice(index, 1)
    return true
  }
  return false
}

// User management functions
export function getAllUsers() {
  return mockDatabase.users
}

export function updateUser(id: string, updates: Partial<User>) {
  const index = mockDatabase.users.findIndex((u) => u.id === id)
  if (index !== -1) {
    mockDatabase.users[index] = { ...mockDatabase.users[index], ...updates }
    return mockDatabase.users[index]
  }
  return null
}

export function deleteUserDb(id: string) {
  const index = mockDatabase.users.findIndex((u) => u.id === id)
  if (index !== -1) {
    mockDatabase.users.splice(index, 1)
    return true
  }
  return false
}

// mockDb object for API usage
export const mockDb = {
  getUsers: getAllUsers,
  updateUser,
  deleteUser: deleteUserDb,

  getInvoices: getAllInvoices,
  getInvoiceById,
  createInvoice: (data: any) => {
    const invoice: Invoice = {
      id: Date.now().toString(),
      invoiceNumber: data.invoiceNumber,
      clientId: data.clientId || "generated",
      clientName: data.clientName,
      amount: data.subtotal,
      gst: data.totalGST,
      total: data.grandTotal,
      date: data.invoiceDate,
      status: data.status || "draft",
      lineItems: data.lineItems,
      createdAt: new Date(),
    }
    return addInvoice(invoice)
  },
  updateInvoice,
  deleteInvoice,
  
  getClients: getAllClients,
  getClientById,
  createClient: (data: any) => {
    const client: Client = {
      id: Date.now().toString(),
      name: data.name,
      email: data.email || "",
      phone: data.phone || "",
      gstin: data.gstin || "",
      address: data.address || "",
      city: data.city || "",
      state: data.state || "",
      createdAt: new Date(),
    }
    return addClient(client)
  },
  updateClientDb: updateClient,
  deleteClientDb: deleteClient,
  
  getProducts: getAllProducts,
  getProductById,
  createProduct: (data: any) => {
    const product: Product = {
      id: Date.now().toString(),
      name: data.name,
      hsn: data.hsn || "",
      description: data.description || "",
      price: data.price || 0,
      taxRate: data.taxRate || 18,
      stock: data.stock || 0,
      createdAt: new Date(),
    }
    return addProduct(product)
  },
  updateProductDb: updateProduct,
  deleteProductDb: deleteProduct,
}
