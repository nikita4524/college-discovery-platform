import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const recruiters = [
  "Google",
  "Microsoft",
  "Amazon",
  "Infosys",
  "TCS",
  "Wipro",
  "Accenture",
  "Goldman Sachs",
  "Flipkart",
  "Deloitte",
];

type CollegeSeed = {
  name: string;
  location: string;
  city: string;
  state: string;
  fees: number;
  rating: number;
  established: number;
  website: string;
  imageUrl: string;
  description: string;
  courses: { name: string; duration: number; fees: number; seats: number }[];
  placement: {
    averagePackage: number;
    highestPackage: number;
    placementRate: number;
    year: number;
  };
};

const getCollegeImage = (name: string): string => {
  const images: Record<string, string> = {
    // IITs
    "IIT Bombay": "/images/colleges/IIT-Bombay.jpg",
    "IIT Delhi": "/images/colleges/IIT-Delhi.jpg",
    "IIT Madras": "/images/colleges/IIT-Madras.jfif",
    "IIT Kanpur": "/images/colleges/IIT-Kanpur.jfif",
    "IIT Kharagpur": "/images/colleges/IIT-Kharagpur.jfif",
    "IIT Roorkee": "/images/colleges/IIT-Roorkee.jfif",
    "IIT Guwahati": "/images/colleges/IIT-Guwahati.jfif",
    "IIT Hyderabad": "/images/colleges/IIT-Hyderabad.jfif",
    
    // NITs
    "NIT Trichy": "/images/colleges/NIT-Trichy.jfif",
    "NIT Surathkal": "/images/colleges/NIT-Surathkal.jfif",
    "NIT Warangal": "/images/colleges/NIT-Warangal.jfif",
    "NIT Calicut": "/images/colleges/NIT-Calicut.jfif",
    
    // BITS
    "BITS Pilani": "/images/colleges/BITS-Pilani.jfif",
    "BITS Goa": "/images/colleges/BITS-Goa.jfif",
    "BITS Hyderabad": "/images/colleges/BITS-Hyderabad.jfif",
    
    // Private Universities
    "VIT Vellore": "/images/colleges/VIT-Vellore.jfif",
    "SRM Institute of Science and Technology": "/images/colleges/SRM-University Chennai.jfif",
    "Manipal Academy of Higher Education": "/images/colleges/Manipal-University.jfif",
    "Thapar Institute of Engineering and Technology": "https://images.pexels.com/photos/207204/pexels-photo-207204.jpeg?auto=compress&cs=tinysrgb&w=800",
    
    // Mumbai Colleges
    "NMIMS Mumbai": "https://images.pexels.com/photos/164558/pexels-photo-164558.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Jai Hind College": "/images/colleges/Hind-College.jfif",
    "Mithibai College": "https://images.pexels.com/photos/1001969/pexels-photo-1001969.jpeg?auto=compress&cs=tinysrgb&w=800",
    
    // Delhi Colleges
    "St. Stephen's College": "https://images.pexels.com/photos/207691/pexels-photo-207691.jpeg?auto=compress&cs=tinysrgb&w=800",
    "Hindu College": "https://images.pexels.com/photos/207204/pexels-photo-207204.jpeg?auto=compress&cs=tinysrgb&w=800",
    "SRCC Delhi University": "/images/colleges/SRCC-Delhi.jfif",
    
    // Other
    "Christ University": "/images/colleges/Christ-University Bangalore.jfif",
    "Symbiosis International University Pune": "/images/colleges/Symbiosis-Pune.jfif",
  };
  
  return images[name] || `https://placehold.co/800x450/3b82f6/white?text=${encodeURIComponent(name)}`;
};

const colleges: CollegeSeed[] = [
  {
    name: "IIT Bombay",
    location: "Powai, Mumbai, Maharashtra",
    city: "Mumbai",
    state: "Maharashtra",
    fees: 230000,
    rating: 4.9,
    established: 1958,
    website: "https://www.iitb.ac.in",
    imageUrl: getCollegeImage("IIT Bombay"),
    description: "Indian Institute of Technology Bombay is a premier public technical university known for engineering excellence and research.",
    courses: [
      { name: "B.Tech Computer Science", duration: 4, fees: 230000, seats: 120 },
      { name: "B.Tech Electrical Engineering", duration: 4, fees: 230000, seats: 100 },
      { name: "M.Tech AI & ML", duration: 2, fees: 180000, seats: 40 },
    ],
    placement: { averagePackage: 2200000, highestPackage: 4500000, placementRate: 95, year: 2025 },
  },
  {
    name: "IIT Delhi",
    location: "Hauz Khas, New Delhi",
    city: "New Delhi",
    state: "Delhi",
    fees: 235000,
    rating: 4.9,
    established: 1961,
    website: "https://home.iitd.ac.in",
    imageUrl: getCollegeImage("IIT Delhi"),
    description: "IIT Delhi ranks among India's top institutions for engineering and technology education.",
    courses: [
      { name: "B.Tech Computer Science", duration: 4, fees: 235000, seats: 110 },
      { name: "B.Tech Mechanical Engineering", duration: 4, fees: 235000, seats: 90 },
      { name: "B.Tech Mathematics & Computing", duration: 4, fees: 235000, seats: 50 },
    ],
    placement: { averagePackage: 2100000, highestPackage: 4200000, placementRate: 94, year: 2025 },
  },
  {
    name: "IIT Madras",
    location: "Adyar, Chennai, Tamil Nadu",
    city: "Chennai",
    state: "Tamil Nadu",
    fees: 225000,
    rating: 4.8,
    established: 1959,
    website: "https://www.iitm.ac.in",
    imageUrl: getCollegeImage("IIT Madras"),
    description: "IIT Madras is renowned for research, innovation, and strong industry partnerships.",
    courses: [
      { name: "B.Tech Computer Science", duration: 4, fees: 225000, seats: 115 },
      { name: "B.Tech Aerospace Engineering", duration: 4, fees: 225000, seats: 60 },
    ],
    placement: { averagePackage: 2000000, highestPackage: 4000000, placementRate: 93, year: 2025 },
  },
  {
    name: "IIT Kanpur",
    location: "Kalyanpur, Kanpur, Uttar Pradesh",
    city: "Kanpur",
    state: "Uttar Pradesh",
    fees: 228000,
    rating: 4.8,
    established: 1959,
    website: "https://www.iitk.ac.in",
    imageUrl: getCollegeImage("IIT Kanpur"),
    description: "IIT Kanpur offers world-class programs in engineering, sciences, and management.",
    courses: [
      { name: "B.Tech Computer Science", duration: 4, fees: 228000, seats: 105 },
      { name: "B.Tech Chemical Engineering", duration: 4, fees: 228000, seats: 80 },
    ],
    placement: { averagePackage: 1900000, highestPackage: 3800000, placementRate: 92, year: 2025 },
  },
  {
    name: "IIT Kharagpur",
    location: "Kharagpur, West Bengal",
    city: "Kharagpur",
    state: "West Bengal",
    fees: 220000,
    rating: 4.8,
    established: 1951,
    website: "https://www.iitkgp.ac.in",
    imageUrl: getCollegeImage("IIT Kharagpur"),
    description: "The oldest IIT, IIT Kharagpur is a leader in engineering education and research in India.",
    courses: [
      { name: "B.Tech Computer Science", duration: 4, fees: 220000, seats: 130 },
      { name: "B.Tech Architecture", duration: 5, fees: 240000, seats: 40 },
    ],
    placement: { averagePackage: 1850000, highestPackage: 3700000, placementRate: 91, year: 2025 },
  },
  {
    name: "IIT Roorkee",
    location: "Roorkee, Uttarakhand",
    city: "Roorkee",
    state: "Uttarakhand",
    fees: 222000,
    rating: 4.7,
    established: 1847,
    website: "https://www.iitr.ac.in",
    imageUrl: getCollegeImage("IIT Roorkee"),
    description: "IIT Roorkee is one of India's oldest technical institutions with excellent placement records.",
    courses: [
      { name: "B.Tech Computer Science", duration: 4, fees: 222000, seats: 100 },
      { name: "B.Tech Civil Engineering", duration: 4, fees: 222000, seats: 120 },
    ],
    placement: { averagePackage: 1800000, highestPackage: 3500000, placementRate: 90, year: 2025 },
  },
  {
    name: "IIT Guwahati",
    location: "North Guwahati, Assam",
    city: "Guwahati",
    state: "Assam",
    fees: 218000,
    rating: 4.7,
    established: 1994,
    website: "https://www.iitg.ac.in",
    imageUrl: getCollegeImage("IIT Guwahati"),
    description: "IIT Guwahati is known for scenic campus and strong programs in engineering and design.",
    courses: [
      { name: "B.Tech Computer Science", duration: 4, fees: 218000, seats: 95 },
      { name: "B.Tech Electronics", duration: 4, fees: 218000, seats: 85 },
    ],
    placement: { averagePackage: 1700000, highestPackage: 3200000, placementRate: 89, year: 2025 },
  },
  {
    name: "IIT Hyderabad",
    location: "Sangareddy, Telangana",
    city: "Hyderabad",
    state: "Telangana",
    fees: 224000,
    rating: 4.7,
    established: 2008,
    website: "https://www.iith.ac.in",
    imageUrl: getCollegeImage("IIT Hyderabad"),
    description: "A young IIT with rapid growth in research and industry collaborations.",
    courses: [
      { name: "B.Tech Computer Science", duration: 4, fees: 224000, seats: 90 },
      { name: "B.Tech AI", duration: 4, fees: 224000, seats: 60 },
    ],
    placement: { averagePackage: 1750000, highestPackage: 3400000, placementRate: 88, year: 2025 },
  },
  {
    name: "NIT Trichy",
    location: "Tiruchirappalli, Tamil Nadu",
    city: "Tiruchirappalli",
    state: "Tamil Nadu",
    fees: 185000,
    rating: 4.6,
    established: 1964,
    website: "https://www.nitt.edu",
    imageUrl: getCollegeImage("NIT Trichy"),
    description: "National Institute of Technology Tiruchirappalli is among the top NITs in India.",
    courses: [
      { name: "B.Tech Computer Science", duration: 4, fees: 185000, seats: 140 },
      { name: "B.Tech ECE", duration: 4, fees: 185000, seats: 120 },
    ],
    placement: { averagePackage: 1200000, highestPackage: 2800000, placementRate: 87, year: 2025 },
  },
  {
    name: "NIT Surathkal",
    location: "Surathkal, Karnataka",
    city: "Mangalore",
    state: "Karnataka",
    fees: 180000,
    rating: 4.5,
    established: 1960,
    website: "https://www.nitk.ac.in",
    imageUrl: getCollegeImage("NIT Surathkal"),
    description: "NIT Surathkal offers excellent coastal campus life and strong placement outcomes.",
    courses: [
      { name: "B.Tech IT", duration: 4, fees: 180000, seats: 100 },
      { name: "B.Tech Mechanical", duration: 4, fees: 180000, seats: 110 },
    ],
    placement: { averagePackage: 1100000, highestPackage: 2500000, placementRate: 85, year: 2025 },
  },
  {
    name: "NIT Warangal",
    location: "Warangal, Telangana",
    city: "Warangal",
    state: "Telangana",
    fees: 178000,
    rating: 4.5,
    established: 1959,
    website: "https://www.nitw.ac.in",
    imageUrl: getCollegeImage("NIT Warangal"),
    description: "One of the oldest NITs with a legacy of producing industry-ready engineers.",
    courses: [
      { name: "B.Tech CSE", duration: 4, fees: 178000, seats: 130 },
      { name: "B.Tech Chemical", duration: 4, fees: 178000, seats: 70 },
    ],
    placement: { averagePackage: 1050000, highestPackage: 2400000, placementRate: 84, year: 2025 },
  },
  {
    name: "NIT Calicut",
    location: "Kozhikode, Kerala",
    city: "Kozhikode",
    state: "Kerala",
    fees: 175000,
    rating: 4.4,
    established: 1961,
    website: "https://www.nitc.ac.in",
    imageUrl: getCollegeImage("NIT Calicut"),
    description: "NIT Calicut is known for academic rigor and vibrant student culture.",
    courses: [
      { name: "B.Tech Computer Science", duration: 4, fees: 175000, seats: 120 },
      { name: "B.Tech Production", duration: 4, fees: 175000, seats: 60 },
    ],
    placement: { averagePackage: 1000000, highestPackage: 2200000, placementRate: 83, year: 2025 },
  },
  {
    name: "BITS Pilani",
    location: "Pilani, Rajasthan",
    city: "Pilani",
    state: "Rajasthan",
    fees: 450000,
    rating: 4.7,
    established: 1964,
    website: "https://www.bits-pilani.ac.in",
    imageUrl: getCollegeImage("BITS Pilani"),
    description: "BITS Pilani is a top private deemed university with flexible academic structure.",
    courses: [
      { name: "B.E. Computer Science", duration: 4, fees: 450000, seats: 200 },
      { name: "B.E. Electronics", duration: 4, fees: 450000, seats: 150 },
      { name: "M.Sc. Economics", duration: 5, fees: 420000, seats: 80 },
    ],
    placement: { averagePackage: 1500000, highestPackage: 3500000, placementRate: 90, year: 2025 },
  },
  {
    name: "BITS Goa",
    location: "Zuarinagar, Goa",
    city: "Goa",
    state: "Goa",
    fees: 440000,
    rating: 4.5,
    established: 2004,
    website: "https://www.bits-pilani.ac.in/goa",
    imageUrl: getCollegeImage("BITS Goa"),
    description: "BITS Goa campus offers the same rigorous curriculum in a scenic coastal setting.",
    courses: [
      { name: "B.E. Computer Science", duration: 4, fees: 440000, seats: 120 },
      { name: "B.E. Mechanical", duration: 4, fees: 440000, seats: 80 },
    ],
    placement: { averagePackage: 1300000, highestPackage: 3000000, placementRate: 88, year: 2025 },
  },
  {
    name: "BITS Hyderabad",
    location: "Hyderabad, Telangana",
    city: "Hyderabad",
    state: "Telangana",
    fees: 445000,
    rating: 4.6,
    established: 2008,
    website: "https://www.bits-pilani.ac.in/hyderabad",
    imageUrl: getCollegeImage("BITS Hyderabad"),
    description: "BITS Hyderabad is a major tech hub campus with strong industry ties.",
    courses: [
      { name: "B.E. Computer Science", duration: 4, fees: 445000, seats: 150 },
      { name: "B.Pharm", duration: 4, fees: 400000, seats: 60 },
    ],
    placement: { averagePackage: 1400000, highestPackage: 3200000, placementRate: 89, year: 2025 },
  },
  {
    name: "VIT Vellore",
    location: "Vellore, Tamil Nadu",
    city: "Vellore",
    state: "Tamil Nadu",
    fees: 198000,
    rating: 4.3,
    established: 1984,
    website: "https://vit.ac.in",
    imageUrl: getCollegeImage("VIT Vellore"),
    description: "VIT is one of India's largest private universities with global partnerships.",
    courses: [
      { name: "B.Tech CSE", duration: 4, fees: 198000, seats: 600 },
      { name: "B.Tech ECE", duration: 4, fees: 198000, seats: 400 },
      { name: "BBA", duration: 3, fees: 150000, seats: 200 },
    ],
    placement: { averagePackage: 800000, highestPackage: 1800000, placementRate: 82, year: 2025 },
  },
  {
    name: "SRM Institute of Science and Technology",
    location: "Chennai, Tamil Nadu",
    city: "Chennai",
    state: "Tamil Nadu",
    fees: 250000,
    rating: 4.2,
    established: 1985,
    website: "https://www.srmist.edu.in",
    imageUrl: getCollegeImage("SRM Institute of Science and Technology"),
    description: "SRM Chennai offers diverse programs with strong focus on innovation and placements.",
    courses: [
      { name: "B.Tech AI & Data Science", duration: 4, fees: 250000, seats: 300 },
      { name: "B.Tech Mechanical", duration: 4, fees: 230000, seats: 250 },
    ],
    placement: { averagePackage: 700000, highestPackage: 1500000, placementRate: 78, year: 2025 },
  },
  {
    name: "Manipal Academy of Higher Education",
    location: "Manipal, Karnataka",
    city: "Manipal",
    state: "Karnataka",
    fees: 320000,
    rating: 4.4,
    established: 1953,
    website: "https://manipal.edu",
    imageUrl: getCollegeImage("Manipal Academy of Higher Education"),
    description: "Manipal University is a multidisciplinary institution with medical and engineering excellence.",
    courses: [
      { name: "B.Tech Computer Science", duration: 4, fees: 320000, seats: 200 },
      { name: "MBBS", duration: 5, fees: 2500000, seats: 150 },
      { name: "BBA", duration: 3, fees: 280000, seats: 120 },
    ],
    placement: { averagePackage: 900000, highestPackage: 2000000, placementRate: 80, year: 2025 },
  },
  {
    name: "Thapar Institute of Engineering and Technology",
    location: "Patiala, Punjab",
    city: "Patiala",
    state: "Punjab",
    fees: 380000,
    rating: 4.3,
    established: 1956,
    website: "https://www.thapar.edu",
    imageUrl: getCollegeImage("Thapar Institute of Engineering and Technology"),
    description: "Thapar University is a leading private engineering institute in North India.",
    courses: [
      { name: "B.E. Computer Engineering", duration: 4, fees: 380000, seats: 180 },
      { name: "B.E. Electronics", duration: 4, fees: 380000, seats: 120 },
    ],
    placement: { averagePackage: 950000, highestPackage: 2100000, placementRate: 81, year: 2025 },
  },
  {
    name: "St. Stephen's College",
    location: "North Campus, New Delhi",
    city: "New Delhi",
    state: "Delhi",
    fees: 50000,
    rating: 4.6,
    established: 1881,
    website: "https://www.ststephens.edu",
    imageUrl: getCollegeImage("St. Stephen's College"),
    description: "Premier constituent college of Delhi University known for humanities and sciences.",
    courses: [
      { name: "B.A. Economics (Hons)", duration: 3, fees: 50000, seats: 60 },
      { name: "B.Sc. Physics (Hons)", duration: 3, fees: 50000, seats: 40 },
    ],
    placement: { averagePackage: 600000, highestPackage: 1200000, placementRate: 75, year: 2025 },
  },
  {
    name: "Hindu College",
    location: "North Campus, New Delhi",
    city: "New Delhi",
    state: "Delhi",
    fees: 45000,
    rating: 4.5,
    established: 1899,
    website: "https://www.hinducollege.ac.in",
    imageUrl: getCollegeImage("Hindu College"),
    description: "One of Delhi University's most prestigious colleges with rich academic heritage.",
    courses: [
      { name: "B.Com (Hons)", duration: 3, fees: 45000, seats: 120 },
      { name: "B.A. English (Hons)", duration: 3, fees: 45000, seats: 80 },
    ],
    placement: { averagePackage: 550000, highestPackage: 1100000, placementRate: 72, year: 2025 },
  },
  {
    name: "Jai Hind College",
    location: "Churchgate, Mumbai, Maharashtra",
    city: "Mumbai",
    state: "Maharashtra",
    fees: 85000,
    rating: 4.3,
    established: 1948,
    website: "https://www.jaihindcollege.com",
    imageUrl: getCollegeImage("Jai Hind College"),
    description: "Affiliated to Mumbai University, Jai Hind is among Mumbai's top commerce and arts colleges.",
    courses: [
      { name: "B.Com", duration: 3, fees: 85000, seats: 200 },
      { name: "BMM", duration: 3, fees: 90000, seats: 60 },
      { name: "BMS", duration: 3, fees: 95000, seats: 80 },
    ],
    placement: { averagePackage: 500000, highestPackage: 900000, placementRate: 70, year: 2025 },
  },
  {
    name: "Mithibai College",
    location: "Vile Parle, Mumbai, Maharashtra",
    city: "Mumbai",
    state: "Maharashtra",
    fees: 75000,
    rating: 4.1,
    established: 1961,
    website: "https://www.mithibai.ac.in",
    imageUrl: getCollegeImage("Mithibai College"),
    description: "Popular Mumbai University college offering diverse undergraduate programs.",
    courses: [
      { name: "B.Com", duration: 3, fees: 75000, seats: 300 },
      { name: "B.Sc. IT", duration: 3, fees: 80000, seats: 120 },
    ],
    placement: { averagePackage: 450000, highestPackage: 800000, placementRate: 68, year: 2025 },
  },
  {
    name: "Christ University",
    location: "Bangalore, Karnataka",
    city: "Bangalore",
    state: "Karnataka",
    fees: 280000,
    rating: 4.4,
    established: 1969,
    website: "https://christuniversity.in",
    imageUrl: getCollegeImage("Christ University"),
    description: "Christ University is a deemed university known for holistic education and placements.",
    courses: [
      { name: "BBA", duration: 3, fees: 280000, seats: 200 },
      { name: "B.Tech CSE", duration: 4, fees: 320000, seats: 150 },
      { name: "LLB", duration: 5, fees: 350000, seats: 60 },
    ],
    placement: { averagePackage: 650000, highestPackage: 1400000, placementRate: 76, year: 2025 },
  },
  {
    name: "Symbiosis International University Pune",
    location: "Lavale, Pune, Maharashtra",
    city: "Pune",
    state: "Maharashtra",
    fees: 350000,
    rating: 4.5,
    established: 1971,
    website: "https://www.siu.edu.in",
    imageUrl: getCollegeImage("Symbiosis International University Pune"),
    description: "Symbiosis Pune offers world-class management, law, and engineering programs.",
    courses: [
      { name: "BBA", duration: 3, fees: 350000, seats: 180 },
      { name: "B.Tech", duration: 4, fees: 380000, seats: 120 },
      { name: "BA LLB", duration: 5, fees: 400000, seats: 80 },
    ],
    placement: { averagePackage: 750000, highestPackage: 1600000, placementRate: 79, year: 2025 },
  },
  {
    name: "NMIMS Mumbai",
    location: "Vile Parle, Mumbai, Maharashtra",
    city: "Mumbai",
    state: "Maharashtra",
    fees: 420000,
    rating: 4.5,
    established: 1981,
    website: "https://www.nmims.edu",
    imageUrl: getCollegeImage("NMIMS Mumbai"),
    description: "NMIMS is a leading private university for management, engineering, and pharmacy.",
    courses: [
      { name: "B.Tech Computer Engineering", duration: 4, fees: 420000, seats: 200 },
      { name: "MBA (Integrated)", duration: 5, fees: 500000, seats: 60 },
      { name: "B.Pharm", duration: 4, fees: 380000, seats: 100 },
    ],
    placement: { averagePackage: 850000, highestPackage: 1900000, placementRate: 82, year: 2025 },
  },
  {
    name: "SRCC Delhi University",
    location: "North Campus, New Delhi",
    city: "New Delhi",
    state: "Delhi",
    fees: 55000,
    rating: 4.7,
    established: 1926,
    website: "https://www.srcc.edu",
    imageUrl: getCollegeImage("SRCC Delhi University"),
    description: "Shri Ram College of Commerce is India's top commerce college under Delhi University.",
    courses: [
      { name: "B.Com (Hons)", duration: 3, fees: 55000, seats: 350 },
      { name: "B.A. Economics (Hons)", duration: 3, fees: 55000, seats: 120 },
    ],
    placement: { averagePackage: 1200000, highestPackage: 2500000, placementRate: 92, year: 2025 },
  },
];

async function main() {
  console.log("🌱 Seeding database...");
  
  await prisma.review.deleteMany();
  await prisma.savedCollege.deleteMany();
  await prisma.course.deleteMany();
  await prisma.placement.deleteMany();
  await prisma.college.deleteMany();

  console.log("🧹 Cleaned existing data");

  for (const c of colleges) {
    await prisma.college.create({
      data: {
        name: c.name,
        location: c.location,
        city: c.city,
        state: c.state,
        fees: c.fees,
        rating: c.rating,
        established: c.established,
        website: c.website,
        imageUrl: c.imageUrl,
        description: c.description,
        courses: { create: c.courses },
        placements: {
          create: {
            averagePackage: c.placement.averagePackage,
            highestPackage: c.placement.highestPackage,
            placementRate: c.placement.placementRate,
            year: c.placement.year,
            topRecruiters: recruiters.slice(0, 6),
          },
        },
      },
    });
    console.log(`✅ Added: ${c.name}`);
  }

  console.log(`🎉 Seeded ${colleges.length} colleges successfully!`);
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });