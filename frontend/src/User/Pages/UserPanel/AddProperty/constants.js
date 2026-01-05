export const PROPERTY_COST = 20;

export const months = [
  { value: "", label: "Select Month" },
  { value: "1", label: "January" },
  { value: "2", label: "February" },
  { value: "3", label: "March" },
  { value: "4", label: "April" },
  { value: "5", label: "May" },
  { value: "6", label: "June" },
  { value: "7", label: "July" },
  { value: "8", label: "August" },
  { value: "9", label: "September" },
  { value: "10", label: "October" },
  { value: "11", label: "November" },
  { value: "12", label: "December" },
];

export const categories = [
  { value: "", label: "Select Category" },
  { value: "2", label: "Bachelor" },
  { value: "1", label: "Family" },
  { value: "5", label: "Hostel" },
  { value: "3", label: "Office" },
  { value: "4", label: "Sublet" },
];

export const dhakaAreas = [
 "Adabor","Airport","Badda","Banani","Bangshal","Bhashantek","Cantonment","Chawkbazar",
  "Darussalam","Daskhinkhan","Demra","Dhamrai","Dhanmondi","Dohar","Gandaria","Gulshan",
  "Hazaribag","Jatrabari","Kafrul","Kalabagan","Kamrangirchar","Keraniganj","Khilgaon",
  "Khilkhet","Kotwali","Lalbag","Mirpur","Mohammadpur","Motijheel","Mugda","Nawabganj",
  "New Market","Others","Pallabi","Paltan","Purbachal","Ramna","Rampura","Rupnagar",
  "Sabujbag","Savar","Shah Ali","Shahbag","Shahjahanpur","Sher-E-Bangla Nagar","Shyampur",
  "Sutrapur","Tejgaon","Tejgaon I/A","Turag","Uttara","Uttarkhan","Vatara","Wari"
];

export const numOptions = (n) =>
  Array.from({ length: n }, (_, i) => ({
    value: `${i + 1}`,
    label: `${i + 1}`,
  }));
