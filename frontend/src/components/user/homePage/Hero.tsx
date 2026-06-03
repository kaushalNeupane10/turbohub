"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Search,
  MapPin,
  Bike,
  Zap,
  Gauge,
} from "lucide-react";

type Vehicle = {
  tag: string;
  name: string;
  image: string;
  horsepower: string;
  performance: string;
  price: string;
};

const vehicles: Vehicle[] = [
  {
    tag: "Sport Sedan",
    name: "Tesla Model S Plaid",
    image:
      "https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&q=80&w=1200",
    horsepower: "1020 HP",
    performance: "2.1s 0-60",
    price: "$149",
  },
  {
    tag: "Adventure Bike",
    name: "BMW GS 1250",
    image:
      "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&q=80&w=1200",
    horsepower: "136 HP",
    performance: "Off-Road",
    price: "$89",
  },
  {
    tag: "Luxury SUV",
    name: "Range Rover Sport",
    image:
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=1200",
    horsepower: "523 HP",
    performance: "AWD",
    price: "$179",
  },
];

export default function Hero() {
  const [activeVehicle, setActiveVehicle] = useState(0);

  const vehicle = vehicles[activeVehicle];

  const handleSearch = () => {
    console.log("Search triggered");
  };

  return (
    <section className="relative overflow-hidden pt-10 pb-20 lg:pt-16 lg:pb-32">
      {/* Background Glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[400px] h-[400px] bg-accent/15 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* LEFT CONTENT */}
          <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand/10 border border-brand/20 text-brand text-xs sm:text-sm font-semibold uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-brand animate-pulse" />
              Unleash Absolute Freedom
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-text-heading leading-[1.1]">
              Dominate the Roads
              <br className="hidden sm:inline" />
              and the{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand to-accent-light">
                Uncharted Trails.
              </span>
            </h1>

            <p className="text-text-muted text-base sm:text-lg md:text-xl max-w-2xl mx-auto lg:mx-0 font-medium">
              Rent premium cars, bikes, EV scooters and luxury rides designed
              for every journey—from city streets to mountain adventures.
            </p>

            {/* SEARCH BAR */}
            <div className="p-4 sm:p-6 rounded-2xl bg-bg-surface border border-border/80 shadow-xl space-y-4 md:space-y-0 md:flex md:items-center md:gap-4 lg:-mr-12 relative z-20">
              <div className="flex-1 min-w-[150px]">
                <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-2">
                  Location
                </label>

                <div className="relative">
                  <MapPin
                    size={16}
                    className="absolute left-3 top-3.5 text-brand"
                  />

                  <select className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-bg-page border border-border text-text-heading focus:border-brand focus:ring-1 focus:ring-brand outline-none text-sm appearance-none font-medium">
                    <option>Select Rental Zone</option>
                    <option>Kathmandu</option>
                    <option>Pokhara</option>
                    <option>Chitwan</option>
                  </select>
                </div>
              </div>

              <div className="hidden md:block w-px h-10 bg-border/40" />

              <div className="flex-1 min-w-[150px]">
                <label className="block text-xs font-bold uppercase tracking-wider text-text-muted mb-2">
                  Vehicle Category
                </label>

                <div className="relative">
                  <Bike
                    size={16}
                    className="absolute left-3 top-3.5 text-brand"
                  />

                  <select className="w-full pl-9 pr-4 py-2.5 rounded-lg bg-bg-page border border-border text-text-heading focus:border-brand focus:ring-1 focus:ring-brand outline-none text-sm appearance-none font-medium">
                    <option>All Vehicles</option>
                    <option>Cars</option>
                    <option>Bikes</option>
                    <option>EV Scooters</option>
                  </select>
                </div>
              </div>

              <button
                onClick={handleSearch}
                className="w-full md:w-auto px-6 py-4 rounded-xl bg-brand text-brand-foreground font-bold shadow-md hover:shadow-brand flex items-center justify-center gap-2 hover:bg-brand-dark transition-all self-end md:h-[46px] md:mt-6"
              >
                <Search size={18} />
                <span>Search Fleet</span>
              </button>
            </div>

            {/* STATS */}
            <div className="grid grid-cols-3 gap-4 pt-4 max-w-md mx-auto lg:mx-0 border-t border-border/40">
              <div>
                <span className="block text-2xl sm:text-3xl font-black text-brand">
                  150+
                </span>
                <span className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                  Vehicles
                </span>
              </div>

              <div>
                <span className="block text-2xl sm:text-3xl font-black text-brand">
                  12K+
                </span>
                <span className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                  Happy Riders
                </span>
              </div>

              <div>
                <span className="block text-2xl sm:text-3xl font-black text-brand">
                  100%
                </span>
                <span className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                  Insured
                </span>
              </div>
            </div>
          </div>

          {/* RIGHT VEHICLE CARD */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-[450px] lg:max-w-none">
              <div className="absolute inset-0 bg-gradient-to-tr from-brand to-accent opacity-20 blur-3xl rounded-3xl" />

              <div className="relative bg-bg-surface border-2 border-brand/30 rounded-2xl p-5 shadow-2xl overflow-hidden group">
                <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:16px_16px]" />

                {/* Image */}
                <div className="relative h-60 sm:h-72 rounded-xl overflow-hidden bg-bg-sunken border border-border mb-4">
                  <Image
                    src={vehicle.image}
                    alt={vehicle.name}
                    fill
                    priority
                    className="object-cover scale-105 group-hover:scale-110 transition-transform duration-700"
                  />

                  <div className="absolute top-3 right-3 bg-brand/90 backdrop-blur-md px-3.5 py-1.5 rounded-lg text-brand-foreground text-xs font-black tracking-wide shadow-md">
                    POPULAR CHOICE
                  </div>
                </div>

                {/* Details */}
                <div className="flex justify-between items-end">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-brand">
                      {vehicle.tag}
                    </span>

                    <h3 className="text-xl font-black text-text-heading mt-1">
                      {vehicle.name}
                    </h3>

                    <div className="flex items-center gap-4 mt-2 text-xs text-text-muted">
                      <span className="flex items-center gap-1">
                        <Zap size={12} className="text-brand" />
                        {vehicle.horsepower}
                      </span>

                      <span className="flex items-center gap-1">
                        <Gauge size={12} className="text-brand" />
                        {vehicle.performance}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="block text-xs font-bold uppercase tracking-wider text-text-muted">
                      Daily Rental
                    </span>

                    <span className="text-2xl font-black text-brand">
                      {vehicle.price}
                      <span className="text-xs font-medium text-text-body">
                        /day
                      </span>
                    </span>
                  </div>
                </div>

                {/* Dots */}
                <div className="flex justify-center gap-2 mt-5">
                  {vehicles.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveVehicle(index)}
                      aria-label={`Vehicle ${index + 1}`}
                      className={`transition-all rounded-full ${
                        activeVehicle === index
                          ? "w-8 h-2.5 bg-brand"
                          : "w-2.5 h-2.5 bg-neutral-300 dark:bg-neutral-700"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}