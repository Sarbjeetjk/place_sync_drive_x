# 🚀 PlaceSync DriveX

PlaceSync DriveX is a unified, intelligent Placement Management Platform designed to seamlessly connect **Students**, **Institutes**, and **Companies**. Engineered with an AI-driven matching algorithm, intuitive role-based dashboards, and complete application tracking, this platform transforms the campus recruitment experience.

---

## 🛠️ Tech Stack Foundational Architecture

The platform is built on modern **MERN** architecture emphasizing speed, modularity, and scalability:

### **Frontend Client**
* **Framework:** [React (Vite)](https://vitejs.dev/) - Lightning-fast frontend build tooling
* **Styling:** [Tailwind CSS](https://tailwindcss.com/) - Utility-first modern CSS framework
* **Routing:** `react-router-dom` - Robust multi-page routing
* **Icons:** `lucide-react` - Crisp, dynamic SVG UI icons
* **Network Intercepts:** `axios` - Clean promise-based REST communication

### **Backend Server**
* **Runtime / Framework:** [Node.js](https://nodejs.org/en/) & [Express.js](https://expressjs.com/)
* **Database:** [MongoDB](https://www.mongodb.com/) featuring [Mongoose](https://mongoosejs.com/) Object Data Modeling (ODM)
* **Authentication:** JWT (JSON Web Tokens) & `bcrypt` password encryption
* **Middleware Context:** CORS, express builtin JSON parsers, Dotenv for secret management

---

## ✨ Key Features & Dashboards

1. **Role-based Security Access Control** 
   - Dynamic conditional routing explicitly locking down endpoints natively to their required roles (`student`, `company`, or `institute`).

2. **🎓 Student Portal**
   - **Live Notifications:** Receives unified announcement broadcasts from participating institutes.
   - **Application Tracking:** Visual status pipelines dynamically tracking their interview phases.
   - **AI Contextual Matching:** Smart role recommendations parsing backend thresholds.

3. **🏢 Company Dashboard**
   - **Job Listing Management:** Create/Delete explicit talent mandates.
   - **AI Auto-Shortlist Sandbox:** Filter candidates hitting strict arbitrary metadata matches (e.g. `≥80%`).
   - **HR Interview Pipeline:** Assign accepted talents dynamically to an interview scheduling queue triggering built-in virtual meet modules.

4. **🏫 Institute Command Center**
   - **Broadcast Notifications:** Cross-platform bridging pushing priority updates instantaneously to student frontends.
   - **Eligibility Criteria Sliders:** Granular visual sliders (CGPA, Branches) persistently filtering and reporting aggregate college placements.
   - **Dynamic Global Reporting:** View live metrics of total placed, applied, and company mandates directly interfacing with MongoDB endpoints.

---

## ⚙️ How to Setup and Run Locally

**Prerequisites:** Ensure you have [Node.js (v18+)](https://nodejs.org/) installed and a running MongoDB instance.

### 1. Clone & Core Setup
Begin by cloning the repository and setting up the two independent environments.

```bash
git clone <your-repository-url>
cd PlaceSync-DriveX
```

### 2. Backend Initialization
The Express server sits gracefully on port `5000`.

```bash
# Navigate to the backend folder
cd backend

# Install all node dependencies
npm install

# IMPORTANT: Establish Environmental Variables
# Create a .env file and add the following two critical keys:
# PORT=5000
# MONGO_URI=mongodb://localhost:27017/placesync   <-- Replace with your cluster URI if hosted
# JWT_SECRET=your_super_secret_jwt_key

# Boot up the dev server 
npm run dev
```

### 3. Frontend Initialization 
The Vite application resolves to port `5173` typically.

```bash
# Open a new terminal tab and navigate into frontend
cd frontend

# Install UI capabilities
npm install

# Start the extremely fast module hot-reloading server
npm run dev
```

### 4. Database Seeding (Optional but Recommended)
To prevent creating everything from scratch, the system contains an automatic baseline seeder script:
* Head to `http://localhost:5173/login` in your modern web browser.
* Explicitly click **"Init Demo Database (Seed)"** at the footer.
* *Result:* Pre-built jobs, companies, and roles are automatically pumped directly into your database so you can seamlessly test features!

---

## 🗄️ Standard Login Credentials (Seeded)
If you executed the baseline seeding, you natively have access to these accounts without manual registration padding:
- **Student Profile:** `student@example.com`
- **Company Profile:** `company@example.com`
- **Institute Administrator:** `institute@example.com`
_Universal test password:_ `password123`
