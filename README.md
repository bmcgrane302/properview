# ProperView - Real Estate Platform 🏠

A Next.js real estate platform with agent dashboards and property management.

---

## 📋 Requirements

- Node.js 18+
- Docker Desktop
- Git

**Install:**
```bash
# macOS
brew install node git
# Download Docker Desktop from docker.com
```

**Verify:**
```bash
node --version    # Should be 18+
docker --version  # Should work
```

---

## 🚀 Quick Start

```bash
# 1. Clone and setup
git clone <repository-url>
cd properview
npm install

# 2. Create enviroment file
cat > .env.local << EOF
MONGODB_URI=mongodb://admin:password@localhost:27017/properview?authSource=admin
EOF

# 3. Start database
npm run docker:up

# 4. Add demo data
npm run seed

# 5. Start app
npm run dev

# 6. Visit http://localhost:3000
```

---

## 🔐 Demo Login

| Agent | Email | Password |
|-------|-------|----------|
| John Smith | `agent@properview.com` | `demo123` |
| Sarah Johnson | `agent2@properview.com` | `demo123` |
| Mike Wilson | `agent3@properview.com` | `demo123` |

**Agent Login:** http://localhost:3000/agent/login

---

## 📱 How to Use

### Public Features
- **Browse Properties:** http://localhost:3000/listings
- **Filter:** By price, bedrooms, location
- **View Details:** Click any property
- **Submit Inquiry:** Contact agents directly

### Agent Features  
- **Login:** Use demo accounts above
- **Dashboard:** View your properties and inquiries
- **Add Property:** Click "Add New Property"
- **Edit/Delete:** Use buttons on property cards
- **View Inquiries:** See buyer messages in dashboard

---

## 🛠️ Commands

```bash
# Development
npm run dev              # Start app

# Database  
npm run docker:up        # Start MongoDB
npm run docker:down      # Stop MongoDB
npm run seed             # Add demo data

```

---

## 🗄️ What's Included

**Demo Data:**
- 9 properties across 3 agents
- 5 sample inquiries
- Different property types and prices

**Features:**
- Multi-agent authentication
- Property CRUD operations  
- Inquiry management
- Responsive design
- RESTful APIs

---

## 🚨 Common Issues

**MongoDB won't start:**
```bash
# Restart Docker Desktop, then:
npm run docker:down
npm run docker:up
sleep 30
```

**No properties showing:**
```bash
npm run seed
```

**Port 3000 in use:**
```bash
PORT=3001 npm run dev
```

**Reset everything:**
```bash
npm run docker:down
npm run docker:up
sleep 30
npm run seed
npm run dev
```

---

## 📂 Project Structure

```
properview/
├── app/
│   ├── api/              # API routes
│   ├── listings/         # Public pages
│   ├── agent/           # Agent pages
│   └── globals.css      # Styles
├── lib/db.js            # Database connection
├── scripts/seed.js      # Demo data
└── docker-compose.yml   # MongoDB setup
```

---

Built with Next.js 14, MongoDB, and Docker.