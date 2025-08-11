export interface Hotel {
  id: string
  name: string
  logo: string
  location: string
  totalRooms: number
  currency: string
}

export interface Guest {
  id: string
  name: string
  phone: string
  email: string
  avatar: string
  checkIn: string
  checkOut: string
  roomNumber: string
  roomType: string
  guests: number
  status: "checked-in" | "checked-out" | "reserved" | "cancelled"
  totalAmount: number
  paidAmount: number
  bookingId: string
}

export interface Room {
  id: string
  number: string
  type: string
  floor: number
  status: "available" | "occupied" | "maintenance" | "cleaning"
  price: number
  amenities: string[]
  currentGuest?: string
}

export interface FoodOrder {
  id: string
  guestId: string
  guestName: string
  roomNumber: string
  items: { name: string; quantity: number; price: number }[]
  total: number
  status: "pending" | "preparing" | "ready" | "delivered" | "cancelled"
  orderTime: string
  deliveryTime?: string
  specialInstructions?: string
}

export interface Invoice {
  id: string
  guestId: string
  guestName: string
  roomNumber: string
  date: string
  items: { description: string; amount: number; quantity: number }[]
  subtotal: number
  tax: number
  total: number
  status: "paid" | "pending" | "overdue"
  paymentMethod?: string
}

export interface Review {
  id: string
  guestId: string
  guestName: string
  rating: number
  comment: string
  date: string
  categories: {
    cleanliness: number
    facilities: number
    location: number
    comfort: number
    service: number
    value: number
  }
  response?: string
}

export interface Message {
  id: string
  guestId: string
  guestName: string
  roomNumber: string
  message: string
  timestamp: string
  type: "request" | "complaint" | "inquiry" | "emergency"
  status: "unread" | "read" | "responded"
  response?: string
}

export const hotels: Hotel[] = [
  {
    id: "hilton",
    name: "Hotel Hilton Garden Inn",
    logo: "/placeholder.svg?height=24&width=24",
    location: "New York, NY",
    totalRooms: 150,
    currency: "USD",
  },
  {
    id: "marriott",
    name: "Hotel Marriott",
    logo: "/placeholder.svg?height=24&width=24",
    location: "Los Angeles, CA",
    totalRooms: 200,
    currency: "USD",
  },
  {
    id: "hyatt",
    name: "Hotel Hyatt",
    logo: "/placeholder.svg?height=24&width=24",
    location: "Chicago, IL",
    totalRooms: 120,
    currency: "USD",
  },
]

export const hotelData: Record<
  string,
  {
    guests: Guest[]
    rooms: Room[]
    foodOrders: FoodOrder[]
    invoices: Invoice[]
    reviews: Review[]
    messages: Message[]
  }
> = {
  hilton: {
    guests: [
      {
        id: "1",
        name: "Ram Kailash",
        phone: "9905598912",
        email: "ram@example.com",
        avatar: "/placeholder.svg?height=32&width=32",
        checkIn: "2024-01-26",
        checkOut: "2024-01-28",
        roomNumber: "101",
        roomType: "1 King Room",
        guests: 2,
        status: "checked-in",
        totalAmount: 1500,
        paidAmount: 150,
        bookingId: "SDK89635",
      },
      {
        id: "2",
        name: "Samira Karki",
        phone: "9815394203",
        email: "samira@example.com",
        avatar: "/placeholder.svg?height=32&width=32",
        checkIn: "2024-01-25",
        checkOut: "2024-01-29",
        roomNumber: "205",
        roomType: "1 Queen Room",
        guests: 5,
        status: "checked-in",
        totalAmount: 5500,
        paidAmount: 5500,
        bookingId: "SDK89636",
      },
      {
        id: "3",
        name: "Jeevan Rai",
        phone: "9865328452",
        email: "jeevan@example.com",
        avatar: "/placeholder.svg?height=32&width=32",
        checkIn: "2024-01-27",
        checkOut: "2024-01-28",
        roomNumber: "310",
        roomType: "1 Deluxe Room",
        guests: 3,
        status: "reserved",
        totalAmount: 2500,
        paidAmount: 150,
        bookingId: "SDK89637",
      },
    ],
    rooms: [
      {
        id: "101",
        number: "101",
        type: "King Room",
        floor: 1,
        status: "occupied",
        price: 250,
        amenities: ["WiFi", "TV", "AC", "Mini Bar"],
        currentGuest: "1",
      },
      {
        id: "102",
        number: "102",
        type: "Queen Room",
        floor: 1,
        status: "available",
        price: 200,
        amenities: ["WiFi", "TV", "AC"],
      },
      {
        id: "205",
        number: "205",
        type: "Queen Room",
        floor: 2,
        status: "occupied",
        price: 200,
        amenities: ["WiFi", "TV", "AC", "Balcony"],
        currentGuest: "2",
      },
      {
        id: "310",
        number: "310",
        type: "Deluxe Room",
        floor: 3,
        status: "cleaning",
        price: 300,
        amenities: ["WiFi", "TV", "AC", "Mini Bar", "Jacuzzi"],
      },
    ],
    foodOrders: [
      {
        id: "FO-1234",
        guestId: "1",
        guestName: "Ram Kailash",
        roomNumber: "101",
        items: [
          { name: "Chicken Curry", quantity: 1, price: 450 },
          { name: "Naan Bread", quantity: 2, price: 50 },
          { name: "Rice", quantity: 1, price: 100 },
        ],
        total: 650,
        status: "delivered",
        orderTime: "2024-01-26T12:30:00",
        deliveryTime: "2024-01-26T13:15:00",
      },
      {
        id: "FO-1235",
        guestId: "2",
        guestName: "Samira Karki",
        roomNumber: "205",
        items: [
          { name: "Vegetable Pasta", quantity: 1, price: 350 },
          { name: "Garlic Bread", quantity: 1, price: 150 },
        ],
        total: 500,
        status: "preparing",
        orderTime: "2024-01-26T13:15:00",
      },
    ],
    invoices: [
      {
        id: "INV-2024-001",
        guestId: "1",
        guestName: "Ram Kailash",
        roomNumber: "101",
        date: "2024-01-26",
        items: [
          { description: "Room Charges (2 nights)", amount: 500, quantity: 2 },
          { description: "Food & Beverages", amount: 300, quantity: 1 },
        ],
        subtotal: 1300,
        tax: 200,
        total: 1500,
        status: "pending",
      },
    ],
    reviews: [
      {
        id: "REV-001",
        guestId: "1",
        guestName: "Ram Kailash",
        rating: 4.5,
        comment: "Great service and clean rooms. The staff was very helpful.",
        date: "2024-01-25",
        categories: {
          cleanliness: 5,
          facilities: 4,
          location: 3,
          comfort: 4,
          service: 5,
          value: 4,
        },
      },
    ],
    messages: [
      {
        id: "MSG-001",
        guestId: "1",
        guestName: "Ram Kailash",
        roomNumber: "101",
        message: "Could you please send extra towels to room 101?",
        timestamp: "2024-01-26T10:30:00",
        type: "request",
        status: "unread",
      },
    ],
  },
  marriott: {
    guests: [
      {
        id: "4",
        name: "John Smith",
        phone: "555-0123",
        email: "john@example.com",
        avatar: "/placeholder.svg?height=32&width=32",
        checkIn: "2024-01-26",
        checkOut: "2024-01-30",
        roomNumber: "401",
        roomType: "Executive Suite",
        guests: 2,
        status: "checked-in",
        totalAmount: 8000,
        paidAmount: 8000,
        bookingId: "MAR12345",
      },
      {
        id: "5",
        name: "Emily Johnson",
        phone: "555-0456",
        email: "emily@example.com",
        avatar: "/placeholder.svg?height=32&width=32",
        checkIn: "2024-01-27",
        checkOut: "2024-01-29",
        roomNumber: "302",
        roomType: "Deluxe Room",
        guests: 1,
        status: "reserved",
        totalAmount: 3000,
        paidAmount: 1500,
        bookingId: "MAR12346",
      },
    ],
    rooms: [
      {
        id: "401",
        number: "401",
        type: "Executive Suite",
        floor: 4,
        status: "occupied",
        price: 500,
        amenities: ["WiFi", "TV", "AC", "Mini Bar", "Jacuzzi", "Balcony"],
        currentGuest: "4",
      },
      {
        id: "302",
        number: "302",
        type: "Deluxe Room",
        floor: 3,
        status: "cleaning",
        price: 350,
        amenities: ["WiFi", "TV", "AC", "Mini Bar"],
      },
    ],
    foodOrders: [
      {
        id: "FO-2001",
        guestId: "4",
        guestName: "John Smith",
        roomNumber: "401",
        items: [
          { name: "Steak Dinner", quantity: 2, price: 850 },
          { name: "Wine Bottle", quantity: 1, price: 200 },
        ],
        total: 1900,
        status: "ready",
        orderTime: "2024-01-26T19:00:00",
      },
    ],
    invoices: [
      {
        id: "INV-2024-101",
        guestId: "4",
        guestName: "John Smith",
        roomNumber: "401",
        date: "2024-01-26",
        items: [
          { description: "Suite Charges (4 nights)", amount: 500, quantity: 4 },
          { description: "Room Service", amount: 800, quantity: 1 },
        ],
        subtotal: 2800,
        tax: 420,
        total: 3220,
        status: "paid",
        paymentMethod: "Credit Card",
      },
    ],
    reviews: [
      {
        id: "REV-101",
        guestId: "4",
        guestName: "John Smith",
        rating: 5,
        comment: "Exceptional service and luxurious accommodations. Highly recommended!",
        date: "2024-01-25",
        categories: {
          cleanliness: 5,
          facilities: 5,
          location: 5,
          comfort: 5,
          service: 5,
          value: 4,
        },
      },
    ],
    messages: [
      {
        id: "MSG-101",
        guestId: "4",
        guestName: "John Smith",
        roomNumber: "401",
        message: "The air conditioning in room 401 is not working properly.",
        timestamp: "2024-01-26T14:20:00",
        type: "complaint",
        status: "read",
        response: "We have dispatched maintenance to fix the AC immediately.",
      },
    ],
  },
  hyatt: {
    guests: [
      {
        id: "6",
        name: "Sarah Wilson",
        phone: "555-0789",
        email: "sarah@example.com",
        avatar: "/placeholder.svg?height=32&width=32",
        checkIn: "2024-01-25",
        checkOut: "2024-01-27",
        roomNumber: "201",
        roomType: "Standard Room",
        guests: 1,
        status: "checked-out",
        totalAmount: 1200,
        paidAmount: 1200,
        bookingId: "HYA54321",
      },
    ],
    rooms: [
      {
        id: "201",
        number: "201",
        type: "Standard Room",
        floor: 2,
        status: "available",
        price: 180,
        amenities: ["WiFi", "TV", "AC"],
      },
    ],
    foodOrders: [],
    invoices: [
      {
        id: "INV-2024-201",
        guestId: "6",
        guestName: "Sarah Wilson",
        roomNumber: "201",
        date: "2024-01-27",
        items: [
          { description: "Room Charges (2 nights)", amount: 180, quantity: 2 },
          { description: "Breakfast", amount: 120, quantity: 2 },
        ],
        subtotal: 600,
        tax: 90,
        total: 690,
        status: "paid",
        paymentMethod: "Cash",
      },
    ],
    reviews: [
      {
        id: "REV-201",
        guestId: "6",
        guestName: "Sarah Wilson",
        rating: 4,
        comment: "Good value for money. Clean and comfortable.",
        date: "2024-01-27",
        categories: {
          cleanliness: 4,
          facilities: 3,
          location: 4,
          comfort: 4,
          service: 4,
          value: 5,
        },
      },
    ],
    messages: [],
  },
}

export const menuItems = [
  { id: "1", name: "Chicken Curry", price: 450, category: "Main Course" },
  { id: "2", name: "Vegetable Pasta", price: 350, category: "Main Course" },
  { id: "3", name: "Club Sandwich", price: 250, category: "Snacks" },
  { id: "4", name: "Naan Bread", price: 50, category: "Bread" },
  { id: "5", name: "Rice", price: 100, category: "Sides" },
  { id: "6", name: "Steak Dinner", price: 850, category: "Premium" },
  { id: "7", name: "Wine Bottle", price: 200, category: "Beverages" },
  { id: "8", name: "Garlic Bread", price: 150, category: "Bread" },
]
