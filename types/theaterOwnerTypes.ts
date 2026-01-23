import mongoose from "mongoose";

export interface tokenType {
  resetToken: string;
  resetPasswordToken: string;
  resetPasswordExpires: string;
}

export interface theaterType {
  theaterOwnerId: mongoose.Types.ObjectId;
  name: string;
  city: string;
  addressLine1: string;
  addressLine2?: string;
  pincode: string;
  state: string;
  country: string;
  showTimes: string[];
  images: string[];
  description: string;
  ticketPrice: number;
  amenities: string[];
  latitude: number;
  longitude: number;
  isListed: boolean;
}
