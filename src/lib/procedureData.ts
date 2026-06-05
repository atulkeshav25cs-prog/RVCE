export const seedProcedures = [
  {
    procedureId: "PROC-001",
    title: "Lost Aadhaar Card",
    category: "Identity Documents",
    description: "Official process to retrieve or reprint a lost Aadhaar card.",
    officialWebsite: "https://uidai.gov.in",
    summary: "Order an Aadhaar PVC Card online or retrieve your E-Aadhaar if you have lost the physical copy.",
    requiredDocuments: ["Registered Mobile Number", "Aadhaar Number or Enrollment ID"],
    steps: [
      "Visit the official UIDAI portal.",
      "Select 'Retrieve EID/UID' if you forgot your number.",
      "Select 'Order Aadhaar PVC Card' to get a physical copy.",
      "Pay the nominal fee of ₹50.",
      "The card will be delivered via Speed Post."
    ],
    processingTime: "5-15 Days",
    fees: "₹50",
    contactInformation: "1947",
    emergencyLevel: "Low"
  },
  {
    procedureId: "PROC-002",
    title: "Lost PAN Card",
    category: "Identity Documents",
    description: "Process to apply for a duplicate PAN card.",
    officialWebsite: "https://www.incometax.gov.in",
    summary: "Request a reprint of your PAN card or download the e-PAN via NSDL or UTIITSL.",
    requiredDocuments: ["Aadhaar Card", "FIR Copy (if stolen)"],
    steps: [
      "Visit the NSDL or UTIITSL portal.",
      "Select 'Reprint of PAN Card'.",
      "Enter your PAN number and Aadhaar number.",
      "Verify OTP sent to your Aadhaar registered mobile.",
      "Pay the reprint fee."
    ],
    processingTime: "7-14 Days",
    fees: "₹50 (India) / ₹959 (Overseas)",
    contactInformation: "1800-180-1961",
    emergencyLevel: "Low"
  },
  {
    procedureId: "PROC-003",
    title: "Lost Driving License",
    category: "Identity Documents",
    description: "How to obtain a duplicate Driving License.",
    officialWebsite: "https://parivahan.gov.in",
    summary: "Apply for a duplicate DL via the Parivahan Sarathi portal after filing a lost report.",
    requiredDocuments: ["FIR / Police LLR", "Address Proof", "LLD Form"],
    steps: [
      "File an online FIR or LLR for the lost license.",
      "Visit the Parivahan portal and select 'Online Services -> Driving License Related Services'.",
      "Select your state and click 'Apply for Duplicate DL'.",
      "Upload the FIR copy and required forms.",
      "Pay the required fee and book an RTO appointment if mandated."
    ],
    processingTime: "10-20 Days",
    fees: "State Dependent (approx ₹200 - ₹500)",
    contactInformation: "State RTO Helpline",
    emergencyLevel: "Low"
  },
  {
    procedureId: "PROC-004",
    title: "Lost Passport",
    category: "Identity Documents",
    description: "Emergency procedure for reporting and replacing a lost passport.",
    officialWebsite: "https://passportindia.gov.in",
    summary: "You must immediately report a lost passport to the nearest police station and apply for a reissue.",
    requiredDocuments: ["FIR Copy", "Address Proof", "Date of Birth Proof", "Old Passport Copy (if available)"],
    steps: [
      "File an FIR at the nearest police station immediately.",
      "Register on the Passport Seva portal.",
      "Apply for 'Re-issue of Passport' and select 'Lost/Damaged' as the reason.",
      "Pay the fee and schedule an appointment at the PSK.",
      "Visit the PSK with the FIR and original documents."
    ],
    processingTime: "15-30 Days",
    fees: "₹3000 (Normal) / ₹5000 (Tatkaal)",
    contactInformation: "1800-258-1800",
    emergencyLevel: "Medium"
  },
  {
    procedureId: "PROC-005",
    title: "Cyber Financial Fraud",
    category: "Cyber Crime",
    description: "Immediate reporting process for UPI, banking, or credit card fraud.",
    officialWebsite: "https://cybercrime.gov.in",
    summary: "Report unauthorized financial transactions to the National Cyber Crime portal immediately to block the funds.",
    requiredDocuments: ["Bank Statement", "Transaction SMS/Email", "ID Proof"],
    steps: [
      "Call 1930 immediately to register a financial fraud complaint.",
      "Block your bank account and cards.",
      "Log in to the National Cyber Crime Reporting Portal.",
      "Select 'Report Financial Fraud'.",
      "Upload evidence (screenshots, bank statements)."
    ],
    processingTime: "Immediate Blocking, 30+ Days Investigation",
    fees: "Free",
    contactInformation: "1930",
    emergencyLevel: "High"
  },
  {
    procedureId: "PROC-006",
    title: "Online Scam Reporting",
    category: "Cyber Crime",
    description: "Report phishing, lottery scams, or social media hacking.",
    officialWebsite: "https://cybercrime.gov.in",
    summary: "File an official complaint against online scams and cyber bullying.",
    requiredDocuments: ["Screenshots of scam", "Suspect details (Phone/URL)", "ID Proof"],
    steps: [
      "Gather all digital evidence (URLs, screenshots, chat logs).",
      "Visit the National Cyber Crime portal.",
      "Select 'Report Other Cyber Crime'.",
      "Fill out the incident details and suspect information.",
      "Submit and note down the acknowledgment number."
    ],
    processingTime: "Varies",
    fees: "Free",
    contactInformation: "1930",
    emergencyLevel: "Medium"
  },
  {
    procedureId: "PROC-007",
    title: "Missing Person Filing",
    category: "Public Safety",
    description: "Standard operating procedure to report a missing person.",
    officialWebsite: "https://digitalpolice.gov.in",
    summary: "Lodge a missing person report with the police and national tracking databases.",
    requiredDocuments: ["Recent Photograph of Missing Person", "Reporter's ID Proof"],
    steps: [
      "Visit the nearest police station immediately (do not wait 24 hours).",
      "Provide a recent photograph and detailed physical description.",
      "Obtain the FIR or Missing Person Report copy.",
      "Authorities will upload details to the ZIPNET/TrackChild portals."
    ],
    processingTime: "Immediate",
    fees: "Free",
    contactInformation: "112 / 1098 (Childline)",
    emergencyLevel: "Critical"
  },
  {
    procedureId: "PROC-008",
    title: "Domestic Violence & Harassment",
    category: "Public Safety",
    description: "Emergency support and legal reporting for domestic violence.",
    officialWebsite: "https://ncwapps.nic.in",
    summary: "Contact the National Commission for Women or local police for immediate rescue and legal aid.",
    requiredDocuments: ["None required for immediate rescue"],
    steps: [
      "In immediate danger, dial 112.",
      "For legal and counseling support, contact the Women Helpline 1091.",
      "Register a formal complaint on the NCW portal.",
      "Seek medical attention if physically harmed."
    ],
    processingTime: "Immediate Response",
    fees: "Free",
    contactInformation: "1091 (Women Helpline) / 112",
    emergencyLevel: "Critical"
  },
  {
    procedureId: "PROC-009",
    title: "Lost Mobile Phone",
    category: "Property & Loss",
    description: "Block and track a stolen or lost mobile phone.",
    officialWebsite: "https://ceir.gov.in",
    summary: "Use the CEIR portal to block the IMEI of your lost phone across all networks in India.",
    requiredDocuments: ["Police Complaint Copy", "Identity Proof", "Mobile Purchase Invoice"],
    steps: [
      "File a report with the police (online or offline).",
      "Get a duplicate SIM card from your telecom provider.",
      "Visit the CEIR portal and select 'Block Stolen/Lost Mobile'.",
      "Submit the FIR copy, IMEI number, and ID proof.",
      "The phone will be blocked and tracked if powered on."
    ],
    processingTime: "24-48 Hours",
    fees: "Free",
    contactInformation: "14422",
    emergencyLevel: "Medium"
  },
  {
    procedureId: "PROC-010",
    title: "Property Damage Claim",
    category: "Property & Loss",
    description: "File a claim for property damaged during public unrest or natural disasters.",
    officialWebsite: "https://ndma.gov.in",
    summary: "Process for claiming compensation for verified property damage.",
    requiredDocuments: ["Property Documents", "Photographic Evidence", "FIR/Incident Report"],
    steps: [
      "Document the damage with photographs and videos.",
      "File an incident report with local authorities/police.",
      "Submit an application to the District Magistrate or relevant state portal.",
      "Await the damage assessment survey by government officials."
    ],
    processingTime: "30-90 Days",
    fees: "Free",
    contactInformation: "District Collectorate",
    emergencyLevel: "Low"
  },
  {
    procedureId: "PROC-011",
    title: "Flood Relief Application",
    category: "Disaster Assistance",
    description: "Apply for immediate state relief funds following flood displacement.",
    officialWebsite: "https://ndma.gov.in",
    summary: "Access emergency funds and shelter provisions deployed by state disaster response forces.",
    requiredDocuments: ["Aadhaar Card", "Bank Account Details", "Proof of Residence in Affected Area"],
    steps: [
      "Register at the nearest official relief camp.",
      "Submit your Aadhaar and Bank details to the camp nodal officer.",
      "Alternatively, apply via your State Disaster Management portal.",
      "Relief funds will be transferred via Direct Benefit Transfer (DBT)."
    ],
    processingTime: "7-14 Days",
    fees: "Free",
    contactInformation: "1070 (Disaster Helpline)",
    emergencyLevel: "High"
  },
  {
    procedureId: "PROC-012",
    title: "Disaster Compensation Claim",
    category: "Disaster Assistance",
    description: "Ex-gratia compensation for injury or loss of life during a disaster.",
    officialWebsite: "https://ndma.gov.in",
    summary: "Claim federal or state compensation for next of kin in the event of a fatal disaster.",
    requiredDocuments: ["Death Certificate / Hospital Records", "Post-mortem Report", "Legal Heir Certificate"],
    steps: [
      "Obtain necessary medical and death certificates.",
      "File the compensation application at the District Magistrate office.",
      "Provide bank account details for the Direct Benefit Transfer.",
      "The claim goes through a verification committee."
    ],
    processingTime: "60-120 Days",
    fees: "Free",
    contactInformation: "District Collectorate",
    emergencyLevel: "Critical"
  }
];
