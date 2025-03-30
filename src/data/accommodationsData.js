// --- START OF FILE accommodationsData.js ---
const accommodationsData = [
    {
      name: "Platinum Beachfront Resort - Ocean View Suite",
      images: [
        "/images/accommodation1_1.jpg",
        "/images/accommodation1_2.jpg",
        "/images/accommodation1_3.jpg",
        // Add more image URLs as needed
      ],
      price: 250, // Price per night for Ocean View Suite
      roomType: "Ocean View Suite", // Added roomType
      bedType: "King Bed",          // Added bedType
      maxOccupancy: 2,             // Added maxOccupancy
      size: "800 sq ft",           // Added size
      amenities: ["Private Balcony", "Jacuzzi Tub", "Ocean View", "Free Wi-Fi", "Room Service"], // Added amenities
      overview:
        "Indulge in breathtaking ocean views from our luxurious suites. Features a private balcony, jacuzzi tub, and king-size bed. Perfect for couples seeking a romantic getaway.",
      themes: ["Luxury", "Beachfront", "Ocean View", "Romantic", "Relaxing"],
      inclusions: ["Breakfast Included", "Welcome Drink", "Evening Turndown Service", "Access to Resort Facilities"],
      exclusions: ["Lunch & Dinner", "Spa Treatments", "Airport Transfers"],
    },
    {
      id: 2,
      name: "Mountain View Cabin - Family Cabin",
      images: [
        "/images/accomodation1.jpg",
        "/images/accommodation2_2.jpg",
        "/images/accommodation2_3.jpg",
        // Add more image URLs as needed
      ],
      price: 150, // Price per night for Family Cabin
      roomType: "Family Cabin",     // Added roomType
      bedType: "Queen Bed + Bunk Beds", // Added bedType
      maxOccupancy: 4,             // Added maxOccupancy
      size: "1200 sq ft",          // Added size
      amenities: ["Full Kitchen", "Fireplace", "Mountain View", "Private Deck", "BBQ Grill"], // Added amenities
      overview:
        "Our spacious family cabin offers stunning mountain views and all the comforts of home. Features a full kitchen, fireplace, and private deck. Ideal for families and nature lovers.",
      themes: ["Nature", "Mountain View", "Family-Friendly", "Cozy", "Secluded"],
      inclusions: ["Kitchen Access", "Firewood", "Parking", "Linens & Towels"],
      exclusions: ["Meals", "Housekeeping Services", "Transportation"],
    },
    // Add more accommodation objects as needed following the same structure
  ];
  
  export default accommodationsData;
  // --- END OF FILE accommodationsData.js ---