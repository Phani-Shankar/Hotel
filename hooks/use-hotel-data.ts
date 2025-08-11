"use client"

import { useState, useEffect } from "react"
import { hotels, hotelData, type Hotel } from "@/lib/hotel-data"

export function useHotelData() {
  const [currentHotel, setCurrentHotel] = useState<Hotel>(hotels[0])
  const [data, setData] = useState(hotelData[hotels[0].id])

  useEffect(() => {
    setData(hotelData[currentHotel.id])
  }, [currentHotel])

  const switchHotel = (hotelId: string) => {
    const hotel = hotels.find((h) => h.id === hotelId)
    if (hotel) {
      setCurrentHotel(hotel)
    }
  }

  const updateGuestData = (updatedGuests: typeof data.guests) => {
    setData((prev) => ({ ...prev, guests: updatedGuests }))
    hotelData[currentHotel.id].guests = updatedGuests
  }

  const updateRoomData = (updatedRooms: typeof data.rooms) => {
    setData((prev) => ({ ...prev, rooms: updatedRooms }))
    hotelData[currentHotel.id].rooms = updatedRooms
  }

  const updateFoodOrders = (updatedOrders: typeof data.foodOrders) => {
    setData((prev) => ({ ...prev, foodOrders: updatedOrders }))
    hotelData[currentHotel.id].foodOrders = updatedOrders
  }

  const updateInvoices = (updatedInvoices: typeof data.invoices) => {
    setData((prev) => ({ ...prev, invoices: updatedInvoices }))
    hotelData[currentHotel.id].invoices = updatedInvoices
  }

  const updateMessages = (updatedMessages: typeof data.messages) => {
    setData((prev) => ({ ...prev, messages: updatedMessages }))
    hotelData[currentHotel.id].messages = updatedMessages
  }

  const updateReviews = (updatedReviews: typeof data.reviews) => {
    setData((prev) => ({ ...prev, reviews: updatedReviews }))
    hotelData[currentHotel.id].reviews = updatedReviews
  }

  return {
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
  }
}
