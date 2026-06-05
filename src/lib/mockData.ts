export const mockAuthorityData = {
  activeIncidents: [
    {
      id: "INC-992",
      type: "Structural Collapse",
      location: "Sector 4, Industrial Zone",
      severity: "CRITICAL",
      time: "10 mins ago",
      assignedUnits: ["Rescue-1", "Med-4", "Fire-2"],
      status: "In Progress"
    },
    {
      id: "INC-991",
      type: "Severe Flooding",
      location: "Riverbank Residential Area",
      severity: "HIGH",
      time: "45 mins ago",
      assignedUnits: ["Water-Rescue-A"],
      status: "Evacuating"
    },
    {
      id: "INC-990",
      type: "Vehicle Collision",
      location: "Highway 9, Mile 42",
      severity: "MEDIUM",
      time: "2 hours ago",
      assignedUnits: ["Traffic-1", "Med-2"],
      status: "Resolved"
    }
  ],
  resourceAvailability: {
    ambulances: { total: 45, available: 12, deployed: 33 },
    fireTrucks: { total: 20, available: 5, deployed: 15 },
    policeUnits: { total: 60, available: 20, deployed: 40 },
    rescueTeams: { total: 15, available: 3, deployed: 12 }
  },
  kpis: {
    activeEmergencies: 24,
    responseTeamsDeployed: 112,
    criticalAlerts: 3,
    avgResponseTime: "8.5m"
  },
  weatherConditions: {
    temp: "24°C",
    condition: "Heavy Rain",
    wind: "28 km/h",
    visibility: "Low",
    alert: "Flash Flood Warning Active"
  }
};

export const mockCitizenData = {
  advisories: [
    {
      id: "ADV-01",
      type: "WARNING",
      title: "Flash Flood Warning",
      message: "Heavy rainfall expected over the next 4 hours. Avoid low-lying areas near the riverbank.",
      time: "Just now"
    },
    {
      id: "ADV-02",
      type: "INFO",
      title: "Road Closure",
      message: "Highway 9 is currently closed due to a severe vehicle collision. Please use alternate routes.",
      time: "2 hours ago"
    }
  ],
  reportHistory: [
    {
      id: "REP-1029",
      type: "Medical Emergency",
      date: "2023-10-15",
      status: "Resolved"
    },
    {
      id: "REP-0844",
      type: "Suspicious Activity",
      date: "2023-08-02",
      status: "Closed"
    }
  ],
  emergencyContacts: [
    { name: "National Emergency", number: "112" },
    { name: "Police", number: "100" },
    { name: "Ambulance", number: "108" },
    { name: "Fire Department", number: "101" },
    { name: "Women Helpline", number: "1091" }
  ]
};
