// ============================================================
// Mock Transport Service
// ============================================================

export type BusStop = {
  order: number;
  name: string;
  time: string;
  isStudentStop: boolean;
};

export type TransportInfo = {
  studentId: string;
  busNumber: string;
  routeName: string;
  routeDescription: string;
  pickupStop: string;
  dropStop: string;
  pickupTime: string;
  dropTime: string;
  driverName: string;
  driverPhone: string;
  attendantName: string;
  vehicleModel: string;
  vehicleCapacity: number;
  stops: BusStop[];
};

const transportSTU001: TransportInfo = {
  studentId: "STU001",
  busNumber: "TN 01 AB 1234",
  routeName: "Route 3 — Anna Nagar",
  routeDescription: "Covers Anna Nagar West, Anna Nagar East, and Mogappair areas",
  pickupStop: "Anna Nagar 7th Avenue",
  dropStop: "Anna Nagar 7th Avenue",
  pickupTime: "07:40 AM",
  dropTime: "04:00 PM",
  driverName: "Mr. Murugan Raj",
  driverPhone: "+91 98400 33333",
  attendantName: "Mrs. Lalitha",
  vehicleModel: "TATA Starbus",
  vehicleCapacity: 42,
  stops: [
    { order: 1, name: "Mogappair East Junction", time: "07:15 AM", isStudentStop: false },
    { order: 2, name: "Mogappair West Park", time: "07:22 AM", isStudentStop: false },
    { order: 3, name: "Anna Nagar Tower Park", time: "07:30 AM", isStudentStop: false },
    { order: 4, name: "Anna Nagar 7th Avenue", time: "07:40 AM", isStudentStop: true },
    { order: 5, name: "Anna Nagar 2nd Avenue", time: "07:48 AM", isStudentStop: false },
    { order: 6, name: "Koyambedu Signal", time: "07:55 AM", isStudentStop: false },
    { order: 7, name: "School Gate", time: "08:15 AM", isStudentStop: false },
  ],
};

const transportSTU002: TransportInfo = {
  studentId: "STU002",
  busNumber: "TN 01 AB 1234",
  routeName: "Route 3 — Anna Nagar",
  routeDescription: "Covers Anna Nagar West, Anna Nagar East, and Mogappair areas",
  pickupStop: "Anna Nagar 7th Avenue",
  dropStop: "Anna Nagar 7th Avenue",
  pickupTime: "07:40 AM",
  dropTime: "04:00 PM",
  driverName: "Mr. Murugan Raj",
  driverPhone: "+91 98400 33333",
  attendantName: "Mrs. Lalitha",
  vehicleModel: "TATA Starbus",
  vehicleCapacity: 42,
  stops: transportSTU001.stops,
};

const transportSTU003: TransportInfo = {
  studentId: "STU003",
  busNumber: "TN 01 CD 5678",
  routeName: "Route 7 — Velachery",
  routeDescription: "Covers Velachery, Pallikaranai, Madipakkam areas",
  pickupStop: "Velachery Main Road",
  dropStop: "Velachery Main Road",
  pickupTime: "07:35 AM",
  dropTime: "04:05 PM",
  driverName: "Mr. Subbaiah",
  driverPhone: "+91 94450 77777",
  attendantName: "Mrs. Kamala",
  vehicleModel: "Ashok Leyland",
  vehicleCapacity: 48,
  stops: [
    { order: 1, name: "Pallikaranai Lake View", time: "07:10 AM", isStudentStop: false },
    { order: 2, name: "Madipakkam Pillar", time: "07:20 AM", isStudentStop: false },
    { order: 3, name: "Velachery Main Road", time: "07:35 AM", isStudentStop: true },
    { order: 4, name: "Velachery Bypass", time: "07:42 AM", isStudentStop: false },
    { order: 5, name: "Guindy Industrial Estate", time: "07:52 AM", isStudentStop: false },
    { order: 6, name: "School Gate", time: "08:15 AM", isStudentStop: false },
  ],
};

const allTransport: Record<string, TransportInfo> = {
  STU001: transportSTU001,
  STU002: transportSTU002,
  STU003: transportSTU003,
};

export function getTransportInfo(studentId: string): TransportInfo | null {
  return allTransport[studentId] ?? null;
}
