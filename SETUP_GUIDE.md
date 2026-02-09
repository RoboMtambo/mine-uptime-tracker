# MineTrack Setup Guide

## Quick Start Guide

### Prerequisites
- Python 3.8+
- Node.js 16+
- pip and npm

### Backend Setup

1. **Install Dependencies**
```bash
cd backend
pip install -r requirements.txt
```

2. **Apply Database Migrations**
```bash
python manage.py migrate
```

3. **Create Superuser (Admin)**
```bash
python manage.py createsuperuser
# Or use the automated script:
./setup_db.sh
```

4. **Start Development Server**
```bash
python manage.py runserver
# Server will be at http://localhost:8000/
```

### Frontend Setup

1. **Install Dependencies**
```bash
npm install
# or
bun install
```

2. **Start Development Server**
```bash
npm run dev
# or
bun run dev
# Frontend will be at http://localhost:8080/
```

---

## Initial Data Setup

### 1. Create a Superuser (if not done automatically)
```bash
cd backend
python manage.py createsuperuser
```
Follow the prompts. The superuser can:
- Create other users
- Add equipment to the system
- View all data

### 2. Login to the Application
1. Go to http://localhost:8080/
2. Enter:
   - **Your Name**: The first and last name of the superuser
   - **ZP/Voltron Number**: The password of the superuser account

### 3. Create Users (as Superuser)
Via API:
```bash
curl -X POST http://localhost:8000/api/accounts/users/create/ \
  -H "Authorization: Bearer <YOUR-TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "John",
    "last_name": "Doe",
    "username": "jdoe",
    "password": "JD2502031",
    "role": "operator",
    "position": "Mine Operator",
    "portal": "Portal 1",
    "zp_number": "ZP2502031"
  }'
```

### 4. Add Equipment (as Superuser)
Via API:
```bash
curl -X POST http://localhost:8000/api/equipment/ \
  -H "Authorization: Bearer <YOUR-TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "LHD 45",
    "machine_type": "LHD",
    "section": "Canaan",
    "installation_date": "2024-01-01"
  }'
```

---

## User Roles and Permissions

### Administrator
- Create and manage users
- Add and manage equipment
- View all reports and dashboards
- Approve reported downtimes

### Technician
- View equipment and downtimes
- Start repairs on reported equipment
- Close downtimes with root cause analysis

### Operator
- Report equipment downtime
- View equipment status
- Track maintenance history

---

## Key Features

### Login System
- Users login with their full name (first + last name)
- Password is their ZP or Voltron identification number
- Supports case-insensitive matching

### Equipment Tracking
- Track all mining equipment
- Monitor current status (running, down, under repair, idle)
- Track maintenance history

### Downtime Reporting
- Report equipment downtime with description and cause
- Single-click repair start process
- Detailed close report with root cause analysis

### Dashboard Analytics
- Real-time equipment status overview
- MTTR (Mean Time To Repair) metrics
- Downtime trends by cause
- Monthly downtime tracking

---

## Troubleshooting

### Database Errors
If you get database errors, try:
```bash
cd backend
python manage.py migrate --fake-initial
python manage.py migrate
```

### Login Issues
- Ensure you use the exact first and last name as registered
- Ensure you use the exact ZP/VLN number as password
- Check that the account is active (not disabled)

### API Errors
- Check that the backend server is running on http://localhost:8000/
- Verify you have a valid JWT token
- Check browser console for CORS errors

### Frontend Build Issues
```bash
# Clear cache and reinstall
rm -rf node_modules
npm install
npm run dev
```

---

## Environment Variables

### Backend (.env or settings.py)
```python
DEBUG = True
ALLOWED_HOSTS = ['localhost', '127.0.0.1']
SECRET_KEY = 'your-secret-key-here'
```

### Frontend (.env)
```
VITE_API_BASE=http://localhost:8000
VITE_APP_NAME=MineTrack
```

---

## Database Schema

### Users
- id, username, email, password (hashed)
- first_name, last_name
- role (operator, technician, admin, supervisor)
- position, portal
- zp_number, vln_number
- is_staff, is_superuser

### Equipment
- id, name, machine_type
- section, location
- status (running, down, under_repair, idle)
- serial_number
- installation_date, last_maintenance
- created_by (foreign key to User)

### Downtimes
- id, equipment_id
- reported_by, start_time, end_time
- description, cause, section
- status (open, in_progress, closed)
- created_at, updated_at

### Repairs
- id, downtime_id
- assigned_to, started_at, completed_at
- root_cause, actions_taken
- parts_used, repair_time
- status (pending, in_progress, completed)

---

## API Documentation

### Authentication
All endpoints require JWT authentication except:
- `POST /api/accounts/login/`
- `POST /api/accounts/token/refresh/`

Example authenticated request:
```bash
curl -H "Authorization: Bearer <token>" http://localhost:8000/api/equipment/
```

### Example Workflow

1. **Login**
```bash
POST /api/accounts/login/
{
  "name": "John Smith",
  "password": "ZP2502031"
}
```

2. **Create Equipment** (Superuser only)
```bash
POST /api/equipment/
{
  "name": "LHD 45",
  "machine_type": "LHD",
  "section": "Canaan"
}
```

3. **Report Downtime**
```bash
POST /api/downtimes/
{
  "equipment": 1,
  "description": "Engine failure",
  "cause": "mechanical",
  "section": "Canaan",
  "start_time": "2026-02-07T10:00:00Z"
}
```

4. **Start Repair**
```bash
POST /api/downtimes/1/start_repair/
{}
```

5. **Close Downtime**
```bash
POST /api/downtimes/1/close_downtime/
{}
```

---

## Development Tips

### Code Structure
```
mine-uptime-tracker-main/
├── backend/                    # Django REST API
│   ├── accounts/              # User management
│   ├── equipment/             # Equipment models
│   ├── downtime/              # Downtime tracking
│   └── mine_track/            # Project settings
├── src/                       # React frontend
│   ├── components/            # Reusable components
│   ├── pages/                 # Page components
│   ├── hooks/                 # Custom React hooks
│   ├── contexts/              # Context providers
│   └── lib/                   # Utilities
└── public/                    # Static files
```

### Frontend State Management
- **AuthContext**: User authentication state
- **Custom Hooks**: useDowntimes, useEquipment, useMetrics, useRepairs

### Backend API Patterns
- RESTful endpoints using Django REST Framework
- JWT authentication using SimpleJWT
- Automatic timestamps on all models
- Soft FK relationships with related_name

### Testing
```bash
# Backend tests
cd backend
python manage.py test

# Frontend tests
npm test
```

---

## Production Deployment Checklist

- [ ] Set `DEBUG = False` in settings
- [ ] Update ALLOWED_HOSTS with domain
- [ ] Set secure SECRET_KEY
- [ ] Configure CORS properly
- [ ] Use environment variables for sensitive data
- [ ] Set up SSL/HTTPS
- [ ] Configure static file serving
- [ ] Set up database backups
- [ ] Configure error logging
- [ ] Load test the API

---

## Support and Documentation

For more information, see:
- `UPDATES.md` - Detailed changelog of all modifications
- Django REST Framework: https://www.django-rest-framework.org/
- React Hooks: https://react.dev/reference/react/hooks
- JWT: https://tools.ietf.org/html/rfc7519

---

Last Updated: February 7, 2026
