export const themes = {
  blue: ["Blue", "Engineering Society", "ES", "oklch(0.52 0.18 255)"],
  green: ["Green", "Environmental Club", "EC", "oklch(0.48 0.13 150)"],
  maroon: ["Maroon", "Student Council", "SC", "oklch(0.43 0.15 20)"],
  violet: ["Violet", "Arts Guild", "AG", "oklch(0.52 0.18 295)"],
};

export const roles = [
  "Org Member",
  "Class Representative",
  "Class Treasurer",
  "Regular Student",
];

export const txns = [
  ["Jun 18, 2025", "BSIT 3-A remittance", "Remittance", 12500, true, "Mariel Santos"],
  ["Jun 16, 2025", "Leadership summit venue", "Expense", 8400, false, "Paolo Reyes"],
  ["Jun 14, 2025", "BSCS 2-B remittance", "Remittance", 9750, true, "Althea Cruz"],
  ["Jun 11, 2025", "Event materials", "Expense", 3250, false, "Nico Ramos"],
  ["Jun 8, 2025", "BSIT 4-A remittance", "Remittance", 11000, true, "Bea Mendoza"],
];

export const remits = [
  ["Jun 18, 2025", "BSIT 3-A", 12500, "Mariel Santos", "pending"],
  ["Jun 14, 2025", "BSCS 2-B", 9750, "Althea Cruz", "confirmed"],
  ["Jun 8, 2025", "BSIT 4-A", 11000, "Bea Mendoza", "confirmed"],
  ["Jun 5, 2025", "BSCpE 2-A", 8250, "Joshua Lim", "rejected"],
  ["May 30, 2025", "BSIS 3-B", 10250, "Dani Flores", "confirmed"],
];

export const people = [
  ["Mariel Santos", "MS", "2022-00184", "BSIT 3-A", "3rd Year", "Class Representative"],
  ["Paolo Reyes", "PR", "2021-00421", "BSIT 4-A", "4th Year", "Class Treasurer"],
  ["Althea Cruz", "AC", "2023-00217", "BSCS 2-B", "2nd Year", "Class Representative"],
  ["Nico Ramos", "NR", "2022-00819", "BSIT 3-A", "3rd Year", "Org Member"],
  ["Bea Mendoza", "BM", "2021-00372", "BSIT 4-A", "4th Year", "Org Member"],
];

export const budget = [
  ["Jan", 82000],
  ["Feb", 94500],
  ["Mar", 88700],
  ["Apr", 112200],
  ["May", 119400],
  ["Jun", 128450],
].map(([month, balance]) => ({ month, balance }));

export const sections = [
  ["IT 3-A", 38500],
  ["CS 2-B", 31250],
  ["IT 4-A", 29000],
  ["IS 3-B", 24750],
  ["CpE 2-A", 18250],
].map(([name, amount]) => ({ name, amount }));

export const php = (n) =>
  new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP" }).format(n);
