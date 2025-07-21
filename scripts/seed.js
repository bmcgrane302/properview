const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI || 'mongodb://admin:password@localhost:27017/properview?authSource=admin';

const sampleProperties = [
  // Agent 1 Properties (John Smith - Senior Agent)
  {
    title: "Modern Downtown Condo",
    price: 750000,
    address: "123 Main Street, Downtown, CA 90210",
    bedrooms: 2,
    bathrooms: 2,
    description: "Beautiful modern condo in the heart of downtown with stunning city views. Features include hardwood floors, granite countertops, and stainless steel appliances.",
    status: "active",
    agentId: "agent1",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Family Home with Large Yard",
    price: 950000,
    address: "456 Oak Avenue, Suburban Heights, CA 90211",
    bedrooms: 4,
    bathrooms: 3,
    description: "Spacious family home with a large backyard, perfect for entertaining. Updated kitchen, master suite, and two-car garage.",
    status: "active",
    agentId: "agent1",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Luxury Penthouse Suite",
    price: 1800000,
    address: "789 Skyline Drive, Beverly Hills, CA 90210",
    bedrooms: 3,
    bathrooms: 3,
    description: "Stunning penthouse with panoramic city views, private elevator access, marble floors, and premium finishes throughout.",
    status: "pending",
    agentId: "agent1",
    createdAt: new Date(),
    updatedAt: new Date()
  },

  // Agent 2 Properties (Sarah Johnson - Real Estate Agent)
  {
    title: "Cozy Studio Apartment",
    price: 425000,
    address: "321 Pine Street, Arts District, CA 90012",
    bedrooms: 1,
    bathrooms: 1,
    description: "Charming studio apartment in the trendy Arts District. Exposed brick walls, high ceilings, and modern fixtures.",
    status: "active",
    agentId: "agent2",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Historic Craftsman Home",
    price: 1200000,
    address: "654 Elm Street, Pasadena, CA 91101",
    bedrooms: 3,
    bathrooms: 2,
    description: "Beautifully restored Craftsman home with original hardwood floors, built-in cabinetry, and a wraparound porch.",
    status: "sold",
    agentId: "agent2",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Beachside Cottage",
    price: 895000,
    address: "789 Ocean Breeze Lane, Santa Monica, CA 90401",
    bedrooms: 2,
    bathrooms: 2,
    description: "Charming beachside cottage just steps from the sand. Perfect for weekend getaways or year-round coastal living.",
    status: "active",
    agentId: "agent2",
    createdAt: new Date(),
    updatedAt: new Date()
  },

  // Agent 3 Properties (Mike Wilson - Property Specialist)
  {
    title: "Modern Townhouse",
    price: 850000,
    address: "987 Maple Court, West Hills, CA 91307",
    bedrooms: 3,
    bathrooms: 3,
    description: "Contemporary townhouse with open floor plan, rooftop deck, and attached garage. Move-in ready!",
    status: "active",
    agentId: "agent3",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Investment Property Duplex",
    price: 1100000,
    address: "246 Cedar Lane, Silver Lake, CA 90026",
    bedrooms: 4,
    bathrooms: 4,
    description: "Great investment opportunity! Duplex with two 2-bedroom units, separate entrances, and parking for 4 cars.",
    status: "active",
    agentId: "agent3",
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    title: "Mountain View Ranch",
    price: 1350000,
    address: "555 Ridge Road, Malibu Hills, CA 90265",
    bedrooms: 4,
    bathrooms: 3,
    description: "Expansive ranch-style home with breathtaking mountain views, horse stables, and 2-acre lot. Perfect for equestrian enthusiasts.",
    status: "pending",
    agentId: "agent3",
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

const sampleInquiries = [
  {
    propertyId: null, // Will be set after properties are inserted
    name: "John Smith",
    email: "john@example.com",
    phone: "(555) 123-4567",
    message: "I'm interested in scheduling a viewing. Is this property still available?",
    createdAt: new Date()
  },
  {
    propertyId: null,
    name: "Sarah Johnson",
    email: "sarah@example.com", 
    phone: "(555) 987-6543",
    message: "Could you provide more information about the neighborhood and nearby schools?",
    createdAt: new Date()
  },
  {
    propertyId: null,
    name: "Michael Chen",
    email: "mchen@email.com",
    phone: "(555) 456-7890",
    message: "I'd like to know more about the HOA fees and what amenities are included.",
    createdAt: new Date()
  },
  {
    propertyId: null,
    name: "Emily Rodriguez",
    email: "emily.r@email.com", 
    phone: "(555) 234-5678",
    message: "Is this property pet-friendly? I have two cats.",
    createdAt: new Date()
  },
  {
    propertyId: null,
    name: "David Park",
    email: "dpark@email.com",
    phone: "(555) 345-6789",
    message: "What's the timeline for closing if we decide to make an offer?",
    createdAt: new Date()
  }
];

async function seedDatabase() {
  console.log('🌱 Starting database seeding...');
  
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');
    
    const db = client.db('properview');
    
    // Clear existing data
    await db.collection('properties').deleteMany({});
    await db.collection('inquiries').deleteMany({});
    console.log('🧹 Cleared existing data');
    
    // Insert properties
    const propertiesResult = await db.collection('properties').insertMany(sampleProperties);
    console.log(`🏠 Inserted ${propertiesResult.insertedCount} properties`);
    
    // Get property IDs for inquiries and distribute them
    const propertyIds = Object.values(propertiesResult.insertedIds);
    
    // Assign inquiries to different properties
    sampleInquiries[0].propertyId = propertyIds[0]; // Agent1 property
    sampleInquiries[1].propertyId = propertyIds[1]; // Agent1 property
    sampleInquiries[2].propertyId = propertyIds[3]; // Agent2 property
    sampleInquiries[3].propertyId = propertyIds[4]; // Agent2 property
    sampleInquiries[4].propertyId = propertyIds[6]; // Agent3 property
    
    // Insert inquiries
    const inquiriesResult = await db.collection('inquiries').insertMany(sampleInquiries);
    console.log(`📨 Inserted ${inquiriesResult.insertedCount} inquiries`);
    
    // Show summary
    console.log('\n📊 Database Summary:');
    
    const agentStats = await db.collection('properties').aggregate([
      { $group: { _id: "$agentId", count: { $sum: 1 }, statuses: { $push: "$status" } } },
      { $sort: { _id: 1 } }
    ]).toArray();
    
    agentStats.forEach(agent => {
      const activeCount = agent.statuses.filter(s => s === 'active').length;
      const pendingCount = agent.statuses.filter(s => s === 'pending').length;
      const soldCount = agent.statuses.filter(s => s === 'sold').length;
      
      console.log(`${agent._id}: ${agent.count} properties (${activeCount} active, ${pendingCount} pending, ${soldCount} sold)`);
    });
    
    const totalInquiries = await db.collection('inquiries').countDocuments();
    console.log(`📨 Total inquiries: ${totalInquiries}`);
    
    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\n👥 Demo Agent Accounts:');
    console.log('agent@properview.com (John Smith - Senior Agent)');
    console.log('agent2@properview.com (Sarah Johnson - Real Estate Agent)');  
    console.log('agent3@properview.com (Mike Wilson - Property Specialist)');
    console.log('Password for all: demo123');
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await client.close();
  }
}

// Run immediately
seedDatabase();