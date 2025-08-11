
"use client"

// Placeholder for renderProfileModal to resolve ReferenceError
const renderProfileModal = () => null;

import React, { useState, useEffect } from "react"
import Image from "next/image"
import {
  Search,
  Plus,
  Edit,
  Trash,
  ChevronDown,
  Home,
  CalendarIcon,
  MessageSquare,
  Star,
  Award,
  CreditCard,
  Utensils,
  Truck,
  Clock,
  DollarSign,
  Filter,
  Download,
  Printer,
  MoreHorizontal,
  Menu,
  CheckCircle,
  XCircle,
  AlertCircle,
  Bed,
  Send,
  Eye,
  UserCheck,
  UserX,
  Calendar,
  Settings,
  LogOut,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/components/ui/use-toast"
import {
  Bar,
  BarChart as RechartsBarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { useHotelData } from "@/hooks/use-hotel-data"
import { menuItems, type Guest, type Room, type FoodOrder } from "@/lib/hotel-data"

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("stays")
  const [activeSection, setActiveSection] = useState("dashboard")
  const [isMobile, setIsMobile] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [newBookingData, setNewBookingData] = useState({
    name: "",
    phone: "",
    email: "",
    checkIn: "",
    checkOut: "",
    roomType: "",
    guests: 1,
  })
  const [newOrderData, setNewOrderData] = useState({
    guestId: "",
    items: [] as { id: string; quantity: number }[],
    specialInstructions: "",
  })

  const [showNotifications, setShowNotifications] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [selectedGuest, setSelectedGuest] = useState<Guest | null>(null)
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null)
  const [selectedOrder, setSelectedOrder] = useState<FoodOrder | null>(null)
  const [selectedInvoice, setSelectedInvoice] = useState<any | null>(null)
  const [selectedMessage, setSelectedMessage] = useState<any | null>(null)
  const [selectedReview, setSelectedReview] = useState<any | null>(null)
  const [userProfile, setUserProfile] = useState({
    name: "John Manager",
    email: "john@hotel.com",
    phone: "+1 (555) 123-4567",
    role: "Hotel Manager",
    avatar: "/placeholder.svg?height=100&width=100",
    notifications: true,
    emailAlerts: true,
    theme: "light"
  })

  // Add activity tracking state
  const [activities, setActivities] = useState<Array<{
    id: string
    type: string
    description: string
    timestamp: string
    user: string
  }>>([
    {
      id: "1",
      type: "check-in",
      description: "Guest Ram Kailash checked into Room 101",
      timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      user: "Front Desk"
    },
    {
      id: "2",
      type: "order",
      description: "New food order placed for Room 205",
      timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
      user: "Room Service"
    },
    {
      id: "3",
      type: "payment",
      description: "Invoice INV-2024-001 marked as paid",
      timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
      user: "Billing"
    },
    {
      id: "4",
      type: "review",
      description: "New review received from John Smith (5 stars)",
      timestamp: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
      user: "System"
    },
    {
      id: "5",
      type: "maintenance",
      description: "Room 310 status changed to maintenance",
      timestamp: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
      user: "Housekeeping"
    }
  ])

  // Add function to add new activity
  const addActivity = (type: string, description: string) => {
    const newActivity = {
      id: Date.now().toString(),
      type,
      description,
      timestamp: new Date().toISOString(),
      user: userProfile.name
    }
    setActivities(prev => [newActivity, ...prev.slice(0, 9)]) // Keep only last 10 activities
  }

  const { toast } = useToast()
  const {
    currentHotel,
    hotels,
    data,
    switchHotel,
    updateGuestData,
    updateRoomData,
    updateFoodOrders,
    updateInvoices,
    updateMessages,
    updateReviews,
  } = useHotelData()

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    handleResize()
    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  // Calculate dashboard statistics
  const stats = {
    totalGuests: data.guests.length,
    checkedIn: data.guests.filter((g) => g.status === "checked-in").length,
    checkingOut: data.guests.filter((g) => g.status === "checked-out").length,
    reservations: data.guests.filter((g) => g.status === "reserved").length,
    occupiedRooms: data.rooms.filter((r) => r.status === "occupied").length,
    availableRooms: data.rooms.filter((r) => r.status === "available").length,
    maintenanceRooms: data.rooms.filter((r) => r.status === "maintenance").length,
    totalRevenue: data.invoices.reduce((sum, inv) => sum + inv.total, 0),
    pendingPayments: data.invoices.filter((inv) => inv.status === "pending").reduce((sum, inv) => sum + inv.total, 0),
    activeOrders: data.foodOrders.filter((order) => order.status !== "delivered" && order.status !== "cancelled")
      .length,
    unreadMessages: data.messages.filter((msg) => msg.status === "unread").length,
    averageRating:
      data.reviews.length > 0 ? data.reviews.reduce((sum, review) => sum + review.rating, 0) / data.reviews.length : 0,
  }

  // Filter functions
  const filteredGuests = data.guests.filter(
    (guest) =>
      guest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guest.phone.includes(searchTerm) ||
      guest.bookingId.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const filteredRooms = data.rooms.filter(
    (room) => room.number.includes(searchTerm) || room.type.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const filteredOrders = data.foodOrders.filter(
    (order) =>
      order.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.roomNumber.includes(searchTerm) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const filteredMessages = data.messages.filter(
    (message) =>
      message.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.roomNumber.includes(searchTerm) ||
      message.message.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Action handlers
  const handleCheckIn = (guestId: string) => {
    const updatedGuests = data.guests.map((guest) =>
      guest.id === guestId ? { ...guest, status: "checked-in" as const } : guest,
    )
    updateGuestData(updatedGuests)

    // Update room status
    const guest = data.guests.find((g) => g.id === guestId)
    if (guest) {
      const updatedRooms = data.rooms.map((room) =>
        room.number === guest.roomNumber ? { ...room, status: "occupied" as const, currentGuest: guestId } : room,
      )
      updateRoomData(updatedRooms)
      addActivity("check-in", `Guest ${guest.name} checked into Room ${guest.roomNumber}`)
    }

    toast({
      title: "Guest Checked In",
      description: `Guest has been successfully checked in.`,
    })
  }

  // Update the handleCheckOut function to add activity tracking
  const handleCheckOut = (guestId: string) => {
    const updatedGuests = data.guests.map((guest) =>
      guest.id === guestId ? { ...guest, status: "checked-out" as const } : guest,
    )
    updateGuestData(updatedGuests)

    // Update room status
    const guest = data.guests.find((g) => g.id === guestId)
    if (guest) {
      const updatedRooms = data.rooms.map((room) =>
        room.number === guest.roomNumber ? { ...room, status: "cleaning" as const, currentGuest: undefined } : room,
      )
      updateRoomData(updatedRooms)
      addActivity("check-out", `Guest ${guest.name} checked out from Room ${guest.roomNumber}`)
    }

    toast({
      title: "Guest Checked Out",
      description: `Guest has been successfully checked out.`,
    })
  }

  // Update handleRoomStatusChange to add activity tracking
  const handleRoomStatusChange = (roomId: string, newStatus: Room["status"]) => {
    const updatedRooms = data.rooms.map((room) => (room.id === roomId ? { ...room, status: newStatus } : room))
    updateRoomData(updatedRooms)
    
    const room = data.rooms.find(r => r.id === roomId)
    if (room) {
      addActivity("maintenance", `Room ${room.number} status changed to ${newStatus}`)
    }

    toast({
      title: "Room Status Updated",
      description: `Room status has been changed to ${newStatus}.`,
    })
  }

  // Update handleOrderStatusChange to add activity tracking  
  const handleOrderStatusChange = (orderId: string, newStatus: FoodOrder["status"]) => {
    const updatedOrders = data.foodOrders.map((order) =>
      order.id === orderId
        ? {
            ...order,
            status: newStatus,
            deliveryTime: newStatus === "delivered" ? new Date().toISOString() : order.deliveryTime,
          }
        : order,
    )
    updateFoodOrders(updatedOrders)
    
    const order = data.foodOrders.find(o => o.id === orderId)
    if (order) {
      addActivity("order", `Order ${orderId} for Room ${order.roomNumber} marked as ${newStatus}`)
    }

    toast({
      title: "Order Status Updated",
      description: `Order ${orderId} status changed to ${newStatus}.`,
    })
  }

  // Update handleAddBooking to add activity tracking
  const handleAddBooking = () => {
    if (!newBookingData.name || !newBookingData.phone || !newBookingData.checkIn || !newBookingData.checkOut) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    const newGuest: Guest = {
      id: Date.now().toString(),
      name: newBookingData.name,
      phone: newBookingData.phone,
      email: newBookingData.email,
      avatar: "/placeholder.svg?height=32&width=32",
      checkIn: newBookingData.checkIn,
      checkOut: newBookingData.checkOut,
      roomNumber: "102", // This should be selected from available rooms
      roomType: newBookingData.roomType,
      guests: newBookingData.guests,
      status: "reserved",
      totalAmount: 1000, // Calculate based on room type and nights
      paidAmount: 0,
      bookingId: `BK${Date.now()}`,
    }

    updateGuestData([...data.guests, newGuest])
    setNewBookingData({
      name: "",
      phone: "",
      email: "",
      checkIn: "",
      checkOut: "",
      roomType: "",
      guests: 1,
    })

    addActivity("booking", `New booking created for ${newGuest.name} - Room ${newGuest.roomNumber}`)

    toast({
      title: "Booking Added",
      description: `New booking created for ${newGuest.name}.`,
    })
  }

  // Update handlePlaceOrder to add activity tracking
  const handlePlaceOrder = () => {
    if (!newOrderData.guestId || newOrderData.items.length === 0) {
      toast({
        title: "Error",
        description: "Please select a guest and at least one item.",
        variant: "destructive",
      })
      return
    }

    const guest = data.guests.find((g) => g.id === newOrderData.guestId)
    if (!guest) return

    const orderItems = newOrderData.items.map((item) => {
      const menuItem = menuItems.find((m) => m.id === item.id)
      return {
        name: menuItem?.name || "",
        quantity: item.quantity,
        price: menuItem?.price || 0,
      }
    })

    const total = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

    const newOrder: FoodOrder = {
      id: `FO-${Date.now()}`,
      guestId: guest.id,
      guestName: guest.name,
      roomNumber: guest.roomNumber,
      items: orderItems,
      total,
      status: "pending",
      orderTime: new Date().toISOString(),
      specialInstructions: newOrderData.specialInstructions,
    }

    updateFoodOrders([...data.foodOrders, newOrder])
    setNewOrderData({
      guestId: "",
      items: [],
      specialInstructions: "",
    })

    addActivity("order", `New food order placed for ${guest.name} - Room ${guest.roomNumber}`)

    toast({
      title: "Order Placed",
      description: `New food order placed for ${guest.name}.`,
    })
  }

  const handleMessageResponse = (messageId: string, response: string) => {
    const updatedMessages = data.messages.map((msg) =>
      msg.id === messageId ? { ...msg, status: "responded" as const, response } : msg,
    )
    updateMessages(updatedMessages)
    toast({
      title: "Response Sent",
      description: "Your response has been sent to the guest.",
    })
  }

  // Chart data
  const revenueData = [
    { name: "Sun", value: stats.totalRevenue * 0.1 },
    { name: "Mon", value: stats.totalRevenue * 0.15 },
    { name: "Tue", value: stats.totalRevenue * 0.12 },
    { name: "Wed", value: stats.totalRevenue * 0.18 },
    { name: "Thu", value: stats.totalRevenue * 0.14 },
    { name: "Fri", value: stats.totalRevenue * 0.16 },
    { name: "Sat", value: stats.totalRevenue * 0.15 },
  ]

  const roomsData = [
    { name: "Available", value: stats.availableRooms, fill: "#10B981" },
    { name: "Occupied", value: stats.occupiedRooms, fill: "#3B82F6" },
    { name: "Maintenance", value: stats.maintenanceRooms, fill: "#F59E0B" },
  ]

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"]

  const renderDashboard = () => (
    <>
      <div className="flex justify-end mb-4">
        <p className="text-sm text-gray-600">
          {new Date().toLocaleDateString("en-US", {
            weekday: "short",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6">
        <Card>
          <CardContent className="p-4 flex items-center">
            <div className="bg-blue-50 p-3 rounded-full mr-4">
              <UserCheck className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Checked In</p>
              <div className="flex items-center">
                <h3 className="text-2xl font-bold mr-2">{stats.checkedIn}</h3>
                <span className="text-xs px-1.5 py-0.5 bg-green-100 text-green-600 rounded">
                  {stats.totalGuests > 0 ? Math.round((stats.checkedIn / stats.totalGuests) * 100) : 0}%
                </span>
              </div>
              <p className="text-xs text-gray-500">Total guests: {stats.totalGuests}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center">
            <div className="bg-amber-50 p-3 rounded-full mr-4">
              <UserX className="h-6 w-6 text-amber-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Available Rooms</p>
              <div className="flex items-center">
                <h3 className="text-2xl font-bold mr-2">{stats.availableRooms}</h3>
                <span className="text-xs px-1.5 py-0.5 bg-blue-100 text-blue-600 rounded">
                  {currentHotel.totalRooms > 0 ? Math.round((stats.availableRooms / currentHotel.totalRooms) * 100) : 0}
                  %
                </span>
              </div>
              <p className="text-xs text-gray-500">Total rooms: {currentHotel.totalRooms}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center">
            <div className="bg-green-50 p-3 rounded-full mr-4">
              <DollarSign className="h-6 w-6 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Revenue</p>
              <div className="flex items-center">
                <h3 className="text-2xl font-bold mr-2">
                  {currentHotel.currency} {stats.totalRevenue.toLocaleString()}
                </h3>
              </div>
              <p className="text-xs text-gray-500">
                Pending: {currentHotel.currency} {stats.pendingPayments.toLocaleString()}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center">
            <div className="bg-purple-50 p-3 rounded-full mr-4">
              <Star className="h-6 w-6 text-purple-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Average Rating</p>
              <div className="flex items-center">
                <h3 className="text-2xl font-bold mr-2">{stats.averageRating.toFixed(1)}</h3>
                <span className="text-xs px-1.5 py-0.5 bg-yellow-100 text-yellow-600 rounded">
                  {data.reviews.length} reviews
                </span>
              </div>
              <p className="text-xs text-gray-500">Unread messages: {stats.unreadMessages}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between p-4 pb-2">
            <CardTitle className="text-base font-medium">Revenue Trend</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsBarChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis hide={true} />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-white p-2 border rounded shadow-sm">
                            <p className="text-xs">
                              {currentHotel.currency} {payload[0].value?.toLocaleString()}
                            </p>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                  <Bar dataKey="value" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                </RechartsBarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between p-4 pb-2">
            <CardTitle className="text-base font-medium">Room Status</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={roomsData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {roomsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="p-4 pb-0">
            <CardTitle className="text-base font-medium">Recent Check-ins</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-3">
              {data.guests
                .filter((g) => g.status === "checked-in")
                .slice(0, 3)
                .map((guest) => (
                  <div key={guest.id} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Avatar className="h-8 w-8 mr-3">
                        <AvatarImage src={guest.avatar || "/placeholder.svg"} alt={guest.name} />
                        <AvatarFallback>
                          {guest.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">{guest.name}</p>
                        <p className="text-xs text-gray-500">Room {guest.roomNumber}</p>
                      </div>
                    </div>
                    <Badge variant="success">Checked In</Badge>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="p-4 pb-0">
            <CardTitle className="text-base font-medium">Active Food Orders</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-3">
              {data.foodOrders
                .filter((order) => order.status !== "delivered" && order.status !== "cancelled")
                .slice(0, 3)
                .map((order) => (
                  <div key={order.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">{order.guestName}</p>
                      <p className="text-xs text-gray-500">
                        Room {order.roomNumber} • {currentHotel.currency} {order.total}
                      </p>
                    </div>
                    <Badge variant={order.status === "preparing" ? "warning" : "default"}>{order.status}</Badge>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )

  // Continue with other render functions...
  const renderCheckInOut = () => (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Check In/Out Management</h2>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search guests..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Booking
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Create New Booking</DialogTitle>
                <DialogDescription>Add a new guest booking to the system.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Guest Name *</Label>
                    <Input
                      id="name"
                      value={newBookingData.name}
                      onChange={(e) => setNewBookingData((prev) => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter guest name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      value={newBookingData.phone}
                      onChange={(e) => setNewBookingData((prev) => ({ ...prev, phone: e.target.value }))}
                      placeholder="Enter phone number"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newBookingData.email}
                    onChange={(e) => setNewBookingData((prev) => ({ ...prev, email: e.target.value }))}
                    placeholder="Enter email address"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="checkin">Check-in Date *</Label>
                    <Input
                      id="checkin"
                      type="date"
                      value={newBookingData.checkIn}
                      onChange={(e) => setNewBookingData((prev) => ({ ...prev, checkIn: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="checkout">Check-out Date *</Label>
                    <Input
                      id="checkout"
                      type="date"
                      value={newBookingData.checkOut}
                      onChange={(e) => setNewBookingData((prev) => ({ ...prev, checkOut: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="roomtype">Room Type</Label>
                    <Select
                      value={newBookingData.roomType}
                      onValueChange={(value) => setNewBookingData((prev) => ({ ...prev, roomType: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select room type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Standard Room">Standard Room</SelectItem>
                        <SelectItem value="Deluxe Room">Deluxe Room</SelectItem>
                        <SelectItem value="King Room">King Room</SelectItem>
                        <SelectItem value="Queen Room">Queen Room</SelectItem>
                        <SelectItem value="Executive Suite">Executive Suite</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="guests">Number of Guests</Label>
                    <Input
                      id="guests"
                      type="number"
                      min="1"
                      value={newBookingData.guests}
                      onChange={(e) =>
                        setNewBookingData((prev) => ({ ...prev, guests: Number.parseInt(e.target.value) || 1 }))
                      }
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleAddBooking}>Create Booking</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 flex items-center">
            <div className="bg-green-50 p-3 rounded-full mr-4">
              <UserCheck className="h-6 w-6 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Checked In Today</p>
              <h3 className="text-2xl font-bold">{stats.checkedIn}</h3>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center">
            <div className="bg-blue-50 p-3 rounded-full mr-4">
              <UserX className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Checking Out Today</p>
              <h3 className="text-2xl font-bold">{stats.checkingOut}</h3>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center">
            <div className="bg-amber-50 p-3 rounded-full mr-4">
              <Calendar className="h-6 w-6 text-amber-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Reservations</p>
              <h3 className="text-2xl font-bold">{stats.reservations}</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Guest Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Guest</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Room</TableHead>
                  <TableHead>Check-in</TableHead>
                  <TableHead>Check-out</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredGuests.map((guest) => (
                  <TableRow key={guest.id}>
                    <TableCell>
                      <div className="flex items-center">
                        <Avatar className="h-8 w-8 mr-3">
                          <AvatarImage src={guest.avatar || "/placeholder.svg"} alt={guest.name} />
                          <AvatarFallback>
                            {guest.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{guest.name}</p>
                          <p className="text-xs text-gray-500">{guest.bookingId}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-sm">{guest.phone}</span>
                        <span className="text-xs text-gray-500">{guest.email}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">Room {guest.roomNumber}</p>
                        <p className="text-xs text-gray-500">{guest.roomType}</p>
                      </div>
                    </TableCell>
                    <TableCell>{new Date(guest.checkIn).toLocaleDateString()}</TableCell>
                    <TableCell>{new Date(guest.checkOut).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          guest.status === "checked-in"
                            ? "success"
                            : guest.status === "reserved"
                              ? "warning"
                              : guest.status === "checked-out"
                                ? "secondary"
                                : "destructive"
                        }
                      >
                        {guest.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        {guest.status === "reserved" && (
                          <Button
                            size="sm"
                            onClick={() => handleCheckIn(guest.id)}
                            className="bg-green-500 hover:bg-green-600"
                          >
                            Check In
                          </Button>
                        )}
                        {guest.status === "checked-in" && (
                          <Button size="sm" variant="outline" onClick={() => handleCheckOut(guest.id)}>
                            Check Out
                          </Button>
                        )}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit Booking
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">
                              <Trash className="h-4 w-4 mr-2" />
                              Cancel Booking
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </>
  )

  const renderRooms = () => (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Room Management</h2>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search rooms..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 flex items-center">
            <div className="bg-green-50 p-3 rounded-full mr-4">
              <CheckCircle className="h-6 w-6 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Available</p>
              <h3 className="text-2xl font-bold">{stats.availableRooms}</h3>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center">
            <div className="bg-blue-50 p-3 rounded-full mr-4">
              <Bed className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Occupied</p>
              <h3 className="text-2xl font-bold">{stats.occupiedRooms}</h3>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center">
            <div className="bg-amber-50 p-3 rounded-full mr-4">
              <AlertCircle className="h-6 w-6 text-amber-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Maintenance</p>
              <h3 className="text-2xl font-bold">{stats.maintenanceRooms}</h3>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center">
            <div className="bg-purple-50 p-3 rounded-full mr-4">
              <Settings className="h-6 w-6 text-purple-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Cleaning</p>
              <h3 className="text-2xl font-bold">{data.rooms.filter((r) => r.status === "cleaning").length}</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredRooms.map((room) => (
          <Card key={room.id} className="relative">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">Room {room.number}</CardTitle>
                  <p className="text-sm text-gray-500">
                    {room.type} • Floor {room.floor}
                  </p>
                </div>
                <Badge
                  variant={
                    room.status === "available"
                      ? "success"
                      : room.status === "occupied"
                        ? "default"
                        : room.status === "maintenance"
                          ? "destructive"
                          : "warning"
                  }
                >
                  {room.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Price per night</span>
                  <span className="font-semibold">
                    {currentHotel.currency} {room.price}
                  </span>
                </div>

                {room.currentGuest && (
                  <div className="flex items-center">
                    <span className="text-sm text-gray-500 mr-2">Current Guest:</span>
                    <span className="text-sm font-medium">
                      {data.guests.find((g) => g.id === room.currentGuest)?.name}
                    </span>
                  </div>
                )}

                <div>
                  <p className="text-sm text-gray-500 mb-2">Amenities:</p>
                  <div className="flex flex-wrap gap-1">
                    {room.amenities.map((amenity, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {amenity}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Select
                    value={room.status}
                    onValueChange={(value) => handleRoomStatusChange(room.id, value as Room["status"])}
                  >
                    <SelectTrigger className="flex-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="available">Available</SelectItem>
                      <SelectItem value="occupied">Occupied</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                      <SelectItem value="cleaning">Cleaning</SelectItem>
                    </SelectContent>
                  </Select>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Room
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <Settings className="h-4 w-4 mr-2" />
                        Maintenance Log
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  )

  const renderMessages = () => (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Guest Messages</h2>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search messages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 flex items-center">
            <div className="bg-red-50 p-3 rounded-full mr-4">
              <MessageSquare className="h-6 w-6 text-red-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Unread</p>
              <h3 className="text-2xl font-bold">{stats.unreadMessages}</h3>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center">
            <div className="bg-blue-50 p-3 rounded-full mr-4">
              <Eye className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Read</p>
              <h3 className="text-2xl font-bold">{data.messages.filter((m) => m.status === "read").length}</h3>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center">
            <div className="bg-green-50 p-3 rounded-full mr-4">
              <Send className="h-6 w-6 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Responded</p>
              <h3 className="text-2xl font-bold">{data.messages.filter((m) => m.status === "responded").length}</h3>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center">
            <div className="bg-amber-50 p-3 rounded-full mr-4">
              <AlertCircle className="h-6 w-6 text-amber-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Emergency</p>
              <h3 className="text-2xl font-bold">{data.messages.filter((m) => m.type === "emergency").length}</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        {filteredMessages.map((message) => (
          <Card key={message.id} className={`${message.status === "unread" ? "border-l-4 border-l-blue-500" : ""}`}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={data.guests.find((g) => g.id === message.guestId)?.avatar || "/placeholder.svg"}
                    />
                    <AvatarFallback>
                      {message.guestName
                        .split(" ")
                        .map((n) => n[0])}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{message.guestName}</p>
                    <p className="text-sm text-gray-500">Room {message.roomNumber}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={
                      message.type === "emergency"
                        ? "destructive"
                        : message.type === "complaint"
                          ? "warning"
                          : message.type === "request"
                            ? "default"
                            : "secondary"
                    }
                  >
                    {message.type}
                  </Badge>
                  <Badge
                    variant={
                      message.status === "unread"
                        ? "destructive"
                        : message.status === "responded"
                          ? "success"
                          : "secondary"
                    }
                  >
                    {message.status}
                  </Badge>
                  <span className="text-xs text-gray-500">{new Date(message.timestamp).toLocaleString()}</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm mb-3">{message.message}</p>

              {message.response && (
                <div className="bg-blue-50 p-3 rounded-md mb-3">
                  <p className="text-sm font-medium text-blue-800 mb-1">Your Response:</p>
                  <p className="text-sm text-blue-700">{message.response}</p>
                </div>
              )}

              {message.status !== "responded" && (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="sm" className="mt-2">
                      <Send className="h-4 w-4 mr-2" />
                      Respond
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Respond to {message.guestName}</DialogTitle>
                      <DialogDescription>Send a response to the guest's {message.type}.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label>Original Message</Label>
                        <div className="bg-gray-50 p-3 rounded-md">
                          <p className="text-sm">{message.message}</p>
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="response">Your Response</Label>
                        <Textarea id="response" placeholder="Type your response here..." rows={4} />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        onClick={() => {
                          const textarea = document.getElementById("response") as HTMLTextAreaElement
                          if (textarea?.value) {
                            handleMessageResponse(message.id, textarea.value)
                          }
                        }}
                      >
                        Send Response
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  )

  const renderCustomerReview = () => (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Customer Reviews</h2>
        <div className="flex gap-2">
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 flex items-center">
            <div className="bg-yellow-50 p-3 rounded-full mr-4">
              <Star className="h-6 w-6 text-yellow-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Average Rating</p>
              <h3 className="text-2xl font-bold">{stats.averageRating.toFixed(1)}</h3>
              <p className="text-xs text-gray-500">{data.reviews.length} reviews</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center">
            <div className="bg-green-50 p-3 rounded-full mr-4">
              <CheckCircle className="h-6 w-6 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500">5 Star Reviews</p>
              <h3 className="text-2xl font-bold">{data.reviews.filter((r) => r.rating === 5).length}</h3>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center">
            <div className="bg-blue-50 p-3 rounded-full mr-4">
              <Award className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500">4+ Star Reviews</p>
              <h3 className="text-2xl font-bold">{data.reviews.filter((r) => r.rating >= 4).length}</h3>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center">
            <div className="bg-red-50 p-3 rounded-full mr-4">
              <XCircle className="h-6 w-6 text-red-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Low Ratings</p>
              <h3 className="text-2xl font-bold">{data.reviews.filter((r) => r.rating < 3).length}</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Rating Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[5, 4, 3, 2, 1].map((rating) => {
                const count = data.reviews.filter((r) => Math.floor(r.rating) === rating).length
                const percentage = data.reviews.length > 0 ? (count / data.reviews.length) * 100 : 0
                return (
                  <div key={rating} className="flex items-center gap-3">
                    <span className="text-sm w-8">{rating} ★</span>
                    <Progress value={percentage} className="flex-1" />
                    <span className="text-sm text-gray-500 w-8">{count}</span>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Category Ratings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {["cleanliness", "facilities", "location", "comfort", "service", "value"].map((category) => {
                const avgRating =
                  data.reviews.length > 0
                    ? data.reviews.reduce(
                        (sum, review) => sum + review.categories[category as keyof typeof review.categories],
                        0,
                      ) / data.reviews.length
                    : 0
                return (
                  <div key={category} className="flex items-center justify-between">
                    <span className="text-sm capitalize">{category}</span>
                    <div className="flex items-center gap-2">
                      <Progress value={(avgRating / 5) * 100} className="w-24" />
                      <span className="text-sm font-medium w-8">{avgRating.toFixed(1)}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        {data.reviews.map((review) => (
          <Card key={review.id}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={data.guests.find((g) => g.id === review.guestId)?.avatar || "/placeholder.svg"} />
                    <AvatarFallback>
                      {review.guestName
                        .split(" ")
                        .map((n) => n[0])}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{review.guestName}</p>
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-4 w-4 ${star <= review.rating ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-500">{review.rating}/5</span>
                    </div>
                  </div>
                </div>
                <span className="text-sm text-gray-500">{new Date(review.date).toLocaleDateString()}</span>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm mb-4">{review.comment}</p>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                {Object.entries(review.categories).map(([category, rating]) => (
                  <div key={category} className="flex justify-between items-center">
                    <span className="text-xs text-gray-500 capitalize">{category}</span>
                    <span className="text-xs font-medium">{rating}/5</span>
                  </div>
                ))}
              </div>

              {review.response && (
                <div className="bg-blue-50 p-3 rounded-md mb-3">
                  <p className="text-sm font-medium text-blue-800 mb-1">Management Response:</p>
                  <p className="text-sm text-blue-700">{review.response}</p>
                </div>
              )}

              {!review.response && (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="sm" variant="outline">
                      <Send className="h-4 w-4 mr-2" />
                      Respond to Review
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Respond to Review</DialogTitle>
                      <DialogDescription>Send a public response to {review.guestName}'s review.</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label>Review</Label>
                        <div className="bg-gray-50 p-3 rounded-md">
                          <p className="text-sm">{review.comment}</p>
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="review-response">Your Response</Label>
                        <Textarea id="review-response" placeholder="Thank you for your feedback..." rows={4} />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        onClick={() => {
                          const textarea = document.getElementById("review-response") as HTMLTextAreaElement
                          if (textarea?.value) {
                            const updatedReviews = data.reviews.map((r) =>
                              r.id === review.id ? { ...r, response: textarea.value } : r,
                            )
                            updateReviews(updatedReviews)
                            toast({
                              title: "Response Posted",
                              description: "Your response has been posted publicly.",
                            })
                          }
                        }}
                      >
                        Post Response
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  )

  const renderBillingSystem = () => (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Billing System</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex items-center gap-1 bg-transparent">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
          <Button variant="outline" size="sm" className="flex items-center gap-1 bg-transparent">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm" className="flex items-center gap-1">
                <Plus className="h-4 w-4" />
                New Invoice
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Create New Invoice</DialogTitle>
                <DialogDescription>
                  Create a new invoice for a guest. Fill in all the required details.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="guest" className="text-right">
                    Guest
                  </Label>
                  <Select>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select guest" />
                    </SelectTrigger>
                    <SelectContent>
                      {data.guests.map((guest) => (
                        <SelectItem key={guest.id} value={guest.id}>
                          {guest.name} - Room {guest.roomNumber}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="date" className="text-right">
                    Date
                  </Label>
                  <Input id="date" type="date" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="amount" className="text-right">
                    Amount
                  </Label>
                  <Input id="amount" type="number" placeholder="0.00" className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right">
                    Description
                  </Label>
                  <Textarea id="description" placeholder="Invoice description" className="col-span-3" />
                </div>
              </div>
              <DialogFooter>
                <Button
                  type="submit"
                  onClick={() => {
                    toast({
                      title: "Invoice created",
                      description: "New invoice has been created successfully",
                    })
                  }}
                >
                  Create Invoice
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 flex items-center">
            <div className="bg-blue-50 p-3 rounded-full mr-4">
              <CreditCard className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Revenue</p>
              <h3 className="text-2xl font-bold">
                {currentHotel.currency} {stats.totalRevenue.toLocaleString()}
              </h3>
              <p className="text-xs text-green-600">+12% from last month</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center">
            <div className="bg-green-50 p-3 rounded-full mr-4">
              <DollarSign className="h-6 w-6 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Paid Invoices</p>
              <h3 className="text-2xl font-bold">
                {currentHotel.currency}{" "}
                {data.invoices
                  .filter((inv) => inv.status === "paid")
                  .reduce((sum, inv) => sum + inv.total, 0)
                  .toLocaleString()}
              </h3>
              <p className="text-xs text-green-600">
                {Math.round(
                  (data.invoices.filter((inv) => inv.status === "paid").length / Math.max(data.invoices.length, 1)) *
                    100,
                )}
                % of total
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center">
            <div className="bg-amber-50 p-3 rounded-full mr-4">
              <Clock className="h-6 w-6 text-amber-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Pending Payments</p>
              <h3 className="text-2xl font-bold">
                {currentHotel.currency} {stats.pendingPayments.toLocaleString()}
              </h3>
              <p className="text-xs text-amber-600">
                {Math.round((stats.pendingPayments / Math.max(stats.totalRevenue, 1)) * 100)}% of total
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-6">
        <CardHeader className="p-4 pb-0">
          <CardTitle className="text-base font-medium">Recent Invoices</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice ID</TableHead>
                  <TableHead>Guest</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.invoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-medium">{invoice.id}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{invoice.guestName}</p>
                        <p className="text-xs text-gray-500">Room {invoice.roomNumber}</p>
                      </div>
                    </TableCell>
                    <TableCell>{new Date(invoice.date).toLocaleDateString()}</TableCell>
                    <TableCell>
                      {currentHotel.currency} {invoice.total.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          invoice.status === "paid"
                            ? "success"
                            : invoice.status === "overdue"
                              ? "destructive"
                              : "warning"
                        }
                      >
                        {invoice.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Invoice
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Printer className="h-4 w-4 mr-2" />
                            Print Invoice
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Download className="h-4 w-4 mr-2" />
                            Download PDF
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600">
                            <Trash className="h-4 w-4 mr-2" />
                            Delete Invoice
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </>
  )

  const renderFoodOrders = () => (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Food Orders</h2>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Place Order
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Place New Food Order</DialogTitle>
                <DialogDescription>Create a new food order for a guest.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div>
                  <Label htmlFor="guest">Guest *</Label>
                  <Select
                    value={newOrderData.guestId}
                    onValueChange={(value) => setNewOrderData((prev) => ({ ...prev, guestId: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select guest" />
                    </SelectTrigger>
                    <SelectContent>
                      {data.guests.map((guest) => (
                        <SelectItem key={guest.id} value={guest.id}>
                          {guest.name} - Room {guest.roomNumber}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Items *</Label>
                  <div className="flex flex-wrap gap-2">
                    {menuItems.map((item) => (
                      <Button
                        key={item.id}
                        variant={selectedItems.includes(item.id) ? "default" : "outline"}
                        onClick={() => {
                          if (selectedItems.includes(item.id)) {
                            setSelectedItems(selectedItems.filter((id) => id !== item.id))
                            setNewOrderData((prev) => ({
                              ...prev,
                              items: prev.items.filter((i) => i.id !== item.id),
                            }))
                          } else {
                            setSelectedItems([...selectedItems, item.id])
                            setNewOrderData((prev) => ({
                              ...prev,
                              items: [...prev.items, { id: item.id, quantity: 1 }],
                            }))
                          }
                        }}
                      >
                        {item.name}
                      </Button>
                    ))}
                  </div>
                </div>
                {selectedItems.length > 0 && (
                  <div>
                    <Label>Quantities</Label>
                    <div className="flex flex-wrap gap-2">
                      {selectedItems.map((itemId) => {
                        const item = menuItems.find((m) => m.id === itemId)
                        return (
                          <div key={itemId} className="flex items-center gap-2">
                            <Label htmlFor={`quantity-${itemId}`}>{item?.name}</Label>
                            <Input
                              id={`quantity-${itemId}`}
                              type="number"
                              min="1"
                              defaultValue={1}
                              onChange={(e) => {
                                const quantity = Number.parseInt(e.target.value) || 1
                                setNewOrderData((prev) => ({
                                  ...prev,
                                  items: prev.items.map((i) => (i.id === itemId ? { ...i, quantity } : i)),
                                }))
                              }}
                              className="w-20"
                            />
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}
                <div>
                  <Label htmlFor="specialInstructions">Special Instructions</Label>
                  <Textarea
                    id="specialInstructions"
                    placeholder="Any special requests?"
                    value={newOrderData.specialInstructions}
                    onChange={(e) =>
                      setNewOrderData((prev) => ({ ...prev, specialInstructions: e.target.value }))
                    }
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handlePlaceOrder}>Place Order</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 flex items-center">
            <div className="bg-blue-50 p-3 rounded-full mr-4">
              <Utensils className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Active Orders</p>
              <h3 className="text-2xl font-bold">{stats.activeOrders}</h3>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center">
            <div className="bg-green-50 p-3 rounded-full mr-4">
              <Truck className="h-6 w-6 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Delivered Today</p>
              <h3 className="text-2xl font-bold">
                {data.foodOrders.filter((order) => new Date(order.deliveryTime || "").toDateString() === new Date().toDateString() && order.status === "delivered").length}
              </h3>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center">
            <div className="bg-amber-50 p-3 rounded-full mr-4">
              <Clock className="h-6 w-6 text-amber-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Pending Orders</p>
              <h3 className="text-2xl font-bold">{data.foodOrders.filter((order) => order.status === "pending").length}</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Order Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Guest</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Order Time</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.id}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{order.guestName}</p>
                        <p className="text-xs text-gray-500">Room {order.roomNumber}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      {order.items.map((item) => (
                        <div key={item.name} className="text-sm">
                          {item.name} x {item.quantity}
                        </div>
                      ))}
                    </TableCell>
                    <TableCell>
                      {currentHotel.currency} {order.total}
                    </TableCell>
                    <TableCell>{new Date(order.orderTime).toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          order.status === "pending"
                            ? "default"
                            : order.status === "preparing"
                              ? "warning"
                              : order.status === "delivered"
                                ? "success"
                                : "secondary"
                        }
                      >
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit Order
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleOrderStatusChange(order.id, "cancelled")} className="text-red-600">
                            <Trash className="h-4 w-4 mr-2" />
                            Cancel Order
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {order.status !== "delivered" && (
                            <DropdownMenuItem onClick={() => handleOrderStatusChange(order.id, "preparing")}>
                              <Clock className="h-4 w-4 mr-2" />
                              Mark as Preparing
                            </DropdownMenuItem>
                          )}
                          {order.status !== "delivered" && (
                            <DropdownMenuItem onClick={() => handleOrderStatusChange(order.id, "delivered")}>
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Mark as Delivered
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </>
  )

  const renderActivityLog = () => (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Activity Log</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>User</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activities.map((activity) => (
                  <TableRow key={activity.id}>
                    <TableCell>
                      <Badge
                        variant={
                          activity.type === "check-in"
                            ? "success"
                            : activity.type === "check-out"
                              ? "secondary"
                              : activity.type === "order"
                                ? "default"
                                : activity.type === "payment"
                                  ? "success"
                                  : activity.type === "review"
                                    ? "default"
                                    : "warning"
                        }
                      >
                        {activity.type}
                      </Badge>
                    </TableCell>
                    <TableCell>{activity.description}</TableCell>
                    <TableCell>{new Date(activity.timestamp).toLocaleString()}</TableCell>
                    <TableCell>{activity.user}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </>
  )

  const renderSettingsPage = () => (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Settings</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>User Profile</CardTitle>
          <CardDescription>Manage your profile information and settings.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="flex items-center space-x-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={userProfile.avatar || "/placeholder.svg"} alt={userProfile.name} />
                <AvatarFallback>
                  {userProfile.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">{userProfile.name}</p>
                <p className="text-xs text-gray-500">{userProfile.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input id="name" value={userProfile.name} disabled />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={userProfile.email} disabled />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" value={userProfile.phone} disabled />
              </div>
              <div>
                <Label htmlFor="role">Role</Label>
                <Input id="role" value={userProfile.role} disabled />
              </div>
            </div>

            <div>
              <Label htmlFor="notifications">Notifications</Label>
              <Checkbox id="notifications" checked={userProfile.notifications} disabled />
            </div>

            <div>
              <Label htmlFor="emailAlerts">Email Alerts</Label>
              <Checkbox id="emailAlerts" checked={userProfile.emailAlerts} disabled />
            </div>

            <div>
              <Label htmlFor="theme">Theme</Label>
              <Select value={userProfile.theme} onValueChange={(value) => setUserProfile((prev) => ({ ...prev, theme: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select theme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="system">System</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline">Update Profile</Button>
        </CardFooter>
      </Card>
    </>
  )


  // Settings Modal
  const renderSettingsModal = () => (
    <Dialog open={showSettings} onOpenChange={setShowSettings}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>System Settings</DialogTitle>
          <DialogDescription>Configure system preferences and hotel settings.</DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="space-y-4">
            <h4 className="text-sm font-medium">Hotel Information</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="hotel-name">Hotel Name</Label>
                <Input id="hotel-name" value={currentHotel.name} disabled className="bg-gray-50" />
              </div>
              <div>
                <Label htmlFor="hotel-location">Location</Label>
                <Input id="hotel-location" value={currentHotel.location} disabled className="bg-gray-50" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="total-rooms">Total Rooms</Label>
                <Input id="total-rooms" value={currentHotel.totalRooms} disabled className="bg-gray-50" />
              </div>
              <div>
                <Label htmlFor="currency">Currency</Label>
                <Select value={currentHotel.currency} disabled>
                  <SelectTrigger className="bg-gray-50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD - US Dollar</SelectItem>
                    <SelectItem value="EUR">EUR - Euro</SelectItem>
                    <SelectItem value="GBP">GBP - British Pound</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-medium">System Preferences</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm">Auto Check-out</p>
                  <p className="text-xs text-gray-500">Automatically check out guests at 12:00 PM</p>
                </div>
                <Checkbox defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm">Room Service Notifications</p>
                  <p className="text-xs text-gray-500">Send notifications for new room service orders</p>
                </div>
                <Checkbox defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm">Daily Reports</p>
                  <p className="text-xs text-gray-500">Generate daily occupancy and revenue reports</p>
                </div>
                <Checkbox defaultChecked />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-medium">Backup & Security</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm">Auto Backup</p>
                  <p className="text-xs text-gray-500">Automatically backup data daily</p>
                </div>
                <Button variant="outline" size="sm">Configure</Button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm">Two-Factor Authentication</p>
                  <p className="text-xs text-gray-500">Add extra security to your account</p>
                </div>
                <Button variant="outline" size="sm">Enable</Button>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-medium">Integrations</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm">Payment Gateway</p>
                  <p className="text-xs text-gray-500">Stripe payment integration</p>
                </div>
                <Badge variant="success">Connected</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm">Email Service</p>
                  <p className="text-xs text-gray-500">Email notifications and marketing</p>
                </div>
                <Badge variant="success">Connected</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm">SMS Service</p>
                  <p className="text-xs text-gray-500">SMS notifications for guests</p>
                </div>
                <Button variant="outline" size="sm">Connect</Button>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setShowSettings(false)}>Close</Button>
          <Button onClick={() => {
            setShowSettings(false)
            toast({
              title: "Settings Saved",
              description: "System settings have been updated successfully.",
            })
          }}>Save Settings</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )

  // Guest Details Modal
  const renderGuestDetailsModal = () => (
    selectedGuest && (
      <Dialog open={!!selectedGuest} onOpenChange={() => setSelectedGuest(null)}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Guest Details</DialogTitle>
            <DialogDescription>Complete information for {selectedGuest.name}</DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={selectedGuest.avatar || "/placeholder.svg"} alt={selectedGuest.name} />
                <AvatarFallback className="text-lg">
                  {selectedGuest.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-lg font-semibold">{selectedGuest.name}</h3>
                <p className="text-sm text-gray-500">Booking ID: {selectedGuest.bookingId}</p>
                <Badge variant={
                  selectedGuest.status === "checked-in" ? "success" :
                  selectedGuest.status === "reserved" ? "warning" :
                  selectedGuest.status === "checked-out" ? "secondary" : "destructive"
                }>
                  {selectedGuest.status}
                </Badge>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-medium">Contact Information</h4>
                <div className="space-y-2">
                  <div>
                    <Label className="text-xs text-gray-500">Phone Number</Label>
                    <p className="text-sm">{selectedGuest.phone}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500">Email Address</Label>
                    <p className="text-sm">{selectedGuest.email}</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-medium">Booking Details</h4>
                <div className="space-y-2">
                  <div>
                    <Label className="text-xs text-gray-500">Room Number</Label>
                    <p className="text-sm font-semibold">Room {selectedGuest.roomNumber}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500">Room Type</Label>
                    <p className="text-sm">{selectedGuest.roomType}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500">Number of Guests</Label>
                    <p className="text-sm">{selectedGuest.guests} Guest{selectedGuest.guests > 1 ? 's' : ''}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-medium">Stay Duration</h4>
                <div className="space-y-2">
                  <div>
                    <Label className="text-xs text-gray-500">Check-in Date</Label>
                    <p className="text-sm">{new Date(selectedGuest.checkIn).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500">Check-out Date</Label>
                    <p className="text-sm">{new Date(selectedGuest.checkOut).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500">Total Nights</Label>
                    <p className="text-sm">
                      {Math.ceil((new Date(selectedGuest.checkOut).getTime() - new Date(selectedGuest.checkIn).getTime()) / (1000 * 60 * 60 * 24))} nights
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-medium">Payment Information</h4>
                <div className="space-y-2">
                  <div>
                    <Label className="text-xs text-gray-500">Total Amount</Label>
                    <p className="text-sm font-semibold">{currentHotel.currency} {selectedGuest.totalAmount}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500">Paid Amount</Label>
                    <p className="text-sm text-green-600">{currentHotel.currency} {selectedGuest.paidAmount}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500">Remaining Balance</Label>
                    <p className="text-sm text-red-600">{currentHotel.currency} {selectedGuest.totalAmount - selectedGuest.paidAmount}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedGuest(null)}>Close</Button>
            <Button>Edit Guest</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  )

  // Room Details Modal
  const renderRoomDetailsModal = () => (
    selectedRoom && (
      <Dialog open={!!selectedRoom} onOpenChange={() => setSelectedRoom(null)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Room {selectedRoom.number} Details</DialogTitle>
            <DialogDescription>Complete information for this room</DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Room {selectedRoom.number}</h3>
                <p className="text-sm text-gray-500">{selectedRoom.type} • Floor {selectedRoom.floor}</p>
              </div>
              <Badge variant={
                selectedRoom.status === "available" ? "success" :
                selectedRoom.status === "occupied" ? "default" :
                selectedRoom.status === "maintenance" ? "destructive" : "warning"
              }>
                {selectedRoom.status}
              </Badge>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-medium">Room Information</h4>
                <div className="space-y-2">
                  <div>
                    <Label className="text-xs text-gray-500">Room Type</Label>
                    <p className="text-sm">{selectedRoom.type}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500">Floor</Label>
                    <p className="text-sm">Floor {selectedRoom.floor}</p>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500">Price per Night</Label>
                    <p className="text-sm font-semibold">{currentHotel.currency} {selectedRoom.price}</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-medium">Current Status</h4>
                <div className="space-y-2">
                  <div>
                    <Label className="text-xs text-gray-500">Status</Label>
                    <p className="text-sm capitalize">{selectedRoom.status}</p>
                  </div>
                  {selectedRoom.currentGuest && (
                    <div>
                      <Label className="text-xs text-gray-500">Current Guest</Label>
                      <p className="text-sm">{data.guests.find(g => g.id === selectedRoom.currentGuest)?.name}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-medium">Amenities</h4>
              <div className="flex flex-wrap gap-2">
                {selectedRoom.amenities.map((amenity, index) => (
                  <Badge key={index} variant="outline">{amenity}</Badge>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedRoom(null)}>Close</Button>
            <Button>Edit Room</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  )

  // Order Details Modal  
  const renderOrderDetailsModal = () => (
    selectedOrder && (
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
            <DialogDescription>Complete information for order {selectedOrder.id}</DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Order {selectedOrder.id}</h3>
                <p className="text-sm text-gray-500">{selectedOrder.guestName} • Room {selectedOrder.roomNumber}</p>
              </div>
              <Badge variant={
                selectedOrder.status === "delivered" ? "success" :
                selectedOrder.status === "preparing" ? "warning" :
                selectedOrder.status === "ready" ? "default" :
                selectedOrder.status === "cancelled" ? "destructive" : "secondary"
              }>
                {selectedOrder.status}
              </Badge>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-medium">Order Items</h4>
              <div className="space-y-2">
                {selectedOrder.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <div>
                      <p className="text-sm font-medium">{item.name}</p>
                      <p className="text-xs text-gray-500">Quantity: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-semibold">{currentHotel.currency} {item.price * item.quantity}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-medium">Order Timeline</h4>
              <div className="space-y-2">
                <div>
                  <Label className="text-xs text-gray-500">Order Time</Label>
                  <p className="text-sm">{new Date(selectedOrder.orderTime).toLocaleString()}</p>
                </div>
                {selectedOrder.deliveryTime && (
                  <div>
                    <Label className="text-xs text-gray-500">Delivery Time</Label>
                    <p className="text-sm">{new Date(selectedOrder.deliveryTime).toLocaleString()}</p>
                  </div>
                )}
                <div>
                  <Label className="text-xs text-gray-500">Total Amount</Label>
                  <p className="text-lg font-bold">{currentHotel.currency} {selectedOrder.total}</p>
                </div>
              </div>
            </div>
            
            {selectedOrder.specialInstructions && (
              <div className="space-y-2">
                <h4 className="font-medium">Special Instructions</h4>
                <p className="text-sm bg-yellow-50 p-3 rounded">{selectedOrder.specialInstructions}</p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedOrder(null)}>Close</Button>
            <Button>Update Order</Button>
          </DialogFooter>
        </DialogContent>
        </Dialog>
    )
  )

  // Invoice Details Modal
  const renderInvoiceDetailsModal = () => (
    selectedInvoice && (
      <Dialog open={!!selectedInvoice} onOpenChange={() => setSelectedInvoice(null)}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Invoice Details</DialogTitle>
            <DialogDescription>Complete information for {selectedInvoice.id}</DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">{selectedInvoice.id}</h3>
                <p className="text-sm text-gray-500">{selectedInvoice.guestName} • Room {selectedInvoice.roomNumber}</p>
              </div>
              <Badge variant={
                selectedInvoice.status === "paid" ? "success" :
                selectedInvoice.status === "overdue" ? "destructive" : "warning"
              }>
                {selectedInvoice.status}
              </Badge>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-xs text-gray-500">Invoice Date</Label>
                <p className="text-sm">{new Date(selectedInvoice.date).toLocaleDateString()}</p>
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-gray-500">Due Date</Label>
                <p className="text-sm">{new Date(new Date(selectedInvoice.date).getTime() + 7*24*60*60*1000).toLocaleDateString()}</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-medium">Invoice Items</h4>
              <div className="space-y-2">
                {selectedInvoice.items.map((item: any, index: number) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <div>
                      <p className="text-sm font-medium">{item.description}</p>
                      <p className="text-xs text-gray-500">Quantity: {item.quantity}</p>
                    </div>
                    <p className="text-sm font-semibold">{currentHotel.currency} {item.amount * item.quantity}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="border-t pt-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Subtotal:</span>
                  <span className="text-sm">{currentHotel.currency} {selectedInvoice.subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Tax:</span>
                  <span className="text-sm">{currentHotel.currency} {selectedInvoice.tax}</span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t pt-2">
                  <span>Total:</span>
                  <span>{currentHotel.currency} {selectedInvoice.total}</span>
                </div>
              </div>
            </div>
            
            {selectedInvoice.paymentMethod && (
              <div className="space-y-2">
                <Label className="text-xs text-gray-500">Payment Method</Label>
                <p className="text-sm">{selectedInvoice.paymentMethod}</p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedInvoice(null)}>Close</Button>
            <Button>
              <Printer className="h-4 w-4 mr-2" />
              Print Invoice
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Menu */}
      {isMobile && (
        <div
          className={`fixed inset-0 z-50 bg-gray-50 transition-transform duration-300 transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
            }`}
        >
          <div className="p-4 flex items-center justify-between">
            <Image src="/logo.svg" alt="Logo" width={120} height={30} />
            <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)}>
              <XCircle className="h-6 w-6" />
            </Button>
          </div>
          <div className="py-4 px-6">
            <Button variant="secondary" className="w-full justify-start mb-2">
              <Home className="h-4 w-4 mr-2" />
              Dashboard
            </Button>
            <Button variant="secondary" className="w-full justify-start mb-2">
              <CalendarIcon className="h-4 w-4 mr-2" />
              Bookings
            </Button>
            <Button variant="secondary" className="w-full justify-start mb-2">
              <MessageSquare className="h-4 w-4 mr-2" />
              Messages
            </Button>
            <Button variant="secondary" className="w-full justify-start mb-2">
              <Star className="h-4 w-4 mr-2" />
              Reviews
            </Button>
            <Button variant="secondary" className="w-full justify-start mb-2">
              <CreditCard className="h-4 w-4 mr-2" />
              Billing
            </Button>
            <Button variant="secondary" className="w-full justify-start mb-2">
              <Utensils className="h-4 w-4 mr-2" />
              Food Orders
            </Button>
            <Button variant="secondary" className="w-full justify-start mb-2">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
            <Button variant="secondary" className="w-full justify-start">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      )}

      <div className="flex">
        {/* Sidebar */}
        {!isMobile && (
          <div className="w-64 h-screen bg-white border-r py-4 px-3">
            <Image src="/logo.svg" alt="Logo" width={120} height={30} className="mb-6" />
            <Button
              variant={activeSection === "dashboard" ? "default" : "secondary"}
              className="w-full justify-start mb-2"
              onClick={() => setActiveSection("dashboard")}
            >
              <Home className="h-4 w-4 mr-2" />
              Dashboard
            </Button>
            <Button
              variant={activeSection === "checkinout" ? "default" : "secondary"}
              className="w-full justify-start mb-2"
              onClick={() => setActiveSection("checkinout")}
            >
              <CalendarIcon className="h-4 w-4 mr-2" />
              Check In/Out
            </Button>
            <Button
              variant={activeSection === "rooms" ? "default" : "secondary"}
              className="w-full justify-start mb-2"
              onClick={() => setActiveSection("rooms")}
            >
              <Bed className="h-4 w-4 mr-2" />
              Rooms
            </Button>
            <Button
              variant={activeSection === "messages" ? "default" : "secondary"}
              className="w-full justify-start mb-2"
              onClick={() => setActiveSection("messages")}
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Messages
            </Button>
            <Button
              variant={activeSection === "reviews" ? "default" : "secondary"}
              className="w-full justify-start mb-2"
              onClick={() => setActiveSection("reviews")}
            >
              <Star className="h-4 w-4 mr-2" />
              Reviews
            </Button>
            <Button
              variant={activeSection === "billing" ? "default" : "secondary"}
              className="w-full justify-start mb-2"
              onClick={() => setActiveSection("billing")}
            >
              <CreditCard className="h-4 w-4 mr-2" />
              Billing
            </Button>
            <Button
              variant={activeSection === "orders" ? "default" : "secondary"}
              className="w-full justify-start mb-2"
              onClick={() => setActiveSection("orders")}
            >
              <Utensils className="h-4 w-4 mr-2" />
              Food Orders
            </Button>
            <Button
              variant={activeSection === "activity" ? "default" : "secondary"}
              className="w-full justify-start mb-2"
              onClick={() => setActiveSection("activity")}
            >
              <Clock className="h-4 w-4 mr-2" />
              Activity Log
            </Button>
            <Button
              variant={activeSection === "settings" ? "default" : "secondary"}
              className="w-full justify-start"
              onClick={() => setActiveSection("settings")}
            >
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
            <div className="border-t pt-4 mt-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="secondary" className="w-full justify-start">
                    <Avatar className="h-6 w-6 mr-2">
                      <AvatarImage src={userProfile.avatar || "/placeholder.svg"} alt={userProfile.name} />
                      <AvatarFallback>
                        {userProfile.name
                          .split(" ")
                          .map((n) => n[0])}
                      </AvatarFallback>
                    </Avatar>
                    {userProfile.name}
                    <ChevronDown className="h-4 w-4 ml-auto" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setShowProfile(true)}>Profile</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setShowNotifications(true)}>Notifications</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setShowSettings(true)}>Settings</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Logout</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        )}

        <div className="flex-1 p-4 md:p-6">
          {/* Mobile Header */}
          {isMobile && (
            <div className="flex items-center justify-between mb-6">
              <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)}>
                <Menu className="h-6 w-6" />
              </Button>
              <h2 className="text-xl font-semibold">{activeSection}</h2>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={userProfile.avatar || "/placeholder.svg"} alt={userProfile.name} />
                      <AvatarFallback>
                        {userProfile.name
                          .split(" ")
                          .map((n) => n[0])}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setShowProfile(true)}>Profile</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setShowNotifications(true)}>Notifications</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setShowSettings(true)}>Settings</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Logout</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}

          {/* Main Content */}
          {activeSection === "dashboard" && renderDashboard()}
          {activeSection === "checkinout" && renderCheckInOut()}
          {activeSection === "rooms" && renderRooms()}
          {activeSection === "messages" && renderMessages()}
          {activeSection === "reviews" && renderCustomerReview()}
          {activeSection === "billing" && renderBillingSystem()}
          {activeSection === "orders" && renderFoodOrders()}
          {activeSection === "activity" && renderActivityLog()}
          {activeSection === "settings" && renderSettingsPage()}
        </div>
      </div>

      {/* Modals */}
      <Dialog open={showNotifications} onOpenChange={setShowNotifications}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Notifications</DialogTitle>
            <DialogDescription>View your recent notifications.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>New Message</CardTitle>
                <CardDescription>You have a new message from John Doe.</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Please check your inbox.</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Booking Confirmation</CardTitle>
                <CardDescription>Your booking for Room 101 has been confirmed.</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Check-in is at 3:00 PM.</p>
              </CardContent>
            </Card>
          </div>
          <DialogFooter>
            <Button onClick={() => setShowNotifications(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {renderProfileModal()}
      {renderSettingsModal()}
      {renderGuestDetailsModal()}
      {renderRoomDetailsModal()}
      {renderOrderDetailsModal()}
      {renderInvoiceDetailsModal()}
    </div>
  )
}
