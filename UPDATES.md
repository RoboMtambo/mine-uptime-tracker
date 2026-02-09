# MineTrack System Updates - February 2026

## Summary of Changes

This document outlines all the changes made to fix and improve the MineTrack equipment downtime tracking system.

---

## 1. USERS AND AUTHENTICATION

### Changes Made:
- **User Model Enhancement**: Added new fields to the User model:
  - `position`: Position/role in the mine (e.g., Overseer Miner, Shift Boss)
  - `portal`: Mine section/portal (e.g., Portal 1)
  - `vln_number`: Voltron identification number
  - `zp_number`: Made optional (allows null values)
  - `is_superuser_admin`: Flag for primary superuser

- **Login System**: Updated login to accept:
  - Full name (first_name + last_name combination)
  - ZP Number or VLN Number as password equivalent
  - Improved validation with better error messages

- **User Management Endpoints**:
  - `/api/accounts/users/create/`: Create new users (superuser only)
  - `/api/accounts/users/`: List all users (authenticated)
  - `/api/accounts/users/<id>/`: View/update user details

### Frontend Changes:
- `Login.tsx`: Updated to ask for "Your Full Name" and "ZP/Voltron Number"
- `AuthContext.tsx`: Updated to send "name" field to backend
- Better error messages and help text

### Database Migration:
- File: `backend/accounts/migrations/0002_update_user_fields.py`

---

## 2. EQUIPMENT MANAGEMENT

### Changes Made:
- **Equipment Model Enhancement**:
  - `machine_type`: Equipment type (LHD, Drill Rig, Bolter, Truck, Grader, Utility Vehicle)
  - `section`: Mine section (e.g., Canaan, Eureka, Rockets)
  - `created_by`: Track which superuser created the equipment
  - Made `serial_number` and `installation_date` optional
  - Auto-populate location from section

- **Equipment Creation**: 
  - Only superuser (`status == 'admin'` or `is_superuser`) can create/modify equipment
  - All other users can view equipment

- **Equipment Status Update**:
  - New endpoint: `PATCH /api/equipment/{id}/update_status/`
  - Allows status transitions between: running, down, under_repair, idle

### Frontend Changes:
- Fixed StatusBadge error by adding `under_repair` to status config

### Database Migration:
- File: `backend/equipment/migrations/0002_update_equipment_fields.py`

---

## 3. DOWNTIME TRACKING AND REPAIR MANAGEMENT

### Changes Made:
- **Downtime Model**:
  - Updated status choices: `open` → `in_progress` → `closed` (was `resolved`)
  - Better relationship tracking with repairs

- **Repair Workflow**:
  1. User reports downtime (status: `open`)
  2. Technician clicks "Start Repair" (status: `in_progress`)
  3. Technician clicks "Close Downtime" with root cause (status: `closed`)
  4. Equipment automatically returns to `running` status

- **New API Endpoints**:
  - `POST /api/downtimes/{id}/start_repair/`: Start repair (move to in_progress)
  - `POST /api/downtimes/{id}/close_downtime/`: Close downtime (move to closed)
  - `GET /api/downtimes/active/`: Get active (open/in_progress) downtimes
  - `GET /api/metrics/`: Get dashboard metrics (real data)

- **Downtime Serializer**:
  - Includes reported_by full name (not just username)
  - Includes equipment details (name, type, section)
  - Auto-updates equipment status when downtime is created

### Frontend Changes:
- `useDowntimes.ts`: Added methods for startRepair, closeDowntime, getActiveDowntimes
- `useRepairs.ts`: Updated to call downtime endpoints instead of creating repairs directly
- `useEquipment.ts`: Properly handles equipment status from backend
- `CloseDowntimeDialog.tsx`: Now calls actual API methods to start/close downtimes

### Database Migration:
- File: `backend/downtime/migrations/0002_update_downtime_models.py`

---

## 4. DASHBOARD AND METRICS

### Changes Made:
- **Dashboard Metrics Endpoint**:
  - Calculates real metrics from database:
    - `total_equipment`: Total registered machines
    - `currently_down`: Equipment currently in 'down' status
    - `total_downtimes`: All time downtime count
    - `week_downtimes`: Downtimes in the last week
    - `mttr_hours`: Mean Time To Repair (calculated from completed repairs)
    - `week_mttr_hours`: MTTR for last week
    - `downtime_by_cause`: Breakdown of downtimes by cause
    - `monthly_trends`: 12-month downtime trends

- **Dashboard Components**:
  - `Dashboard.tsx`: Updated to use real metrics
  - `DowntimeByCauseChart.tsx`: Pulls real data from metrics
  - `MonthlyTrendsChart.tsx`: Shows real 12-month trends

### Frontend Changes:
- `useMetrics.ts`: Enhanced to handle new metrics structure
- Dashboard now auto-refreshes metrics every 5 minutes
- Better handling of empty data states

---

## 5. BUG FIXES

### Equipment Tab Error (StatusBadge)
- **Problem**: `Cannot read properties of undefined (reading 'className')`
- **Root Cause**: StatusBadge config didn't include `under_repair` status
- **Solution**: Added `under_repair` config to statusConfig in `status-badge.tsx`

---

## 6. DATABASE SETUP

### Running Migrations:
```bash
cd backend
python manage.py migrate
```

### Creating Initial Superuser:
```bash
python manage.py createsuperuser
# Follow the prompts to create an admin user
```

Or use the automated script:
```bash
chmod +x setup_db.sh
./setup_db.sh
```

---

## 7. API ENDPOINTS SUMMARY

### Authentication
- `POST /api/accounts/login/` - Login with name and ZP/VLN number
- `POST /api/accounts/token/refresh/` - Refresh JWT token

### User Management
- `POST /api/accounts/users/create/` - Create new user (superuser only)
- `GET /api/accounts/users/` - List all users
- `GET /api/accounts/users/<id>/` - Get user details
- `PUT /api/accounts/users/<id>/` - Update user (superuser or self only)

### Equipment
- `GET /api/equipment/` - List all equipment
- `POST /api/equipment/` - Create equipment (superuser only)
- `GET /api/equipment/{id}/` - Get equipment details
- `PATCH /api/equipment/{id}/update_status/` - Update equipment status

### Downtimes & Repairs
- `GET /api/downtimes/` - List all downtimes
- `POST /api/downtimes/` - Create/report downtime
- `GET /api/downtimes/{id}/` - Get downtime details
- `POST /api/downtimes/{id}/start_repair/` - Start repair process
- `POST /api/downtimes/{id}/close_downtime/` - Close downtime
- `GET /api/downtimes/active/` - Get active downtimes
- `GET /api/repairs/` - List repairs
- `GET /api/metrics/` - Get dashboard metrics

---

## 8. TESTING THE CHANGES

### 1. Test User Creation (Superuser)
```bash
curl -X POST http://localhost:8000/api/accounts/users/create/ \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "John",
    "last_name": "Smith",
    "username": "jsmith",
    "password": "TestPassword123",
    "role": "operator",
    "position": "Overseer Miner",
    "portal": "Portal 1",
    "zp_number": "ZP2502031"
  }'
```

### 2. Test Login
```bash
curl -X POST http://localhost:8000/api/accounts/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Smith",
    "password": "ZP2502031"
  }'
```

### 3. Test Equipment Creation (Superuser)
```bash
curl -X POST http://localhost:8000/api/equipment/ \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "LHD 45",
    "machine_type": "LHD",
    "section": "Canaan",
    "serial_number": "LHD-45-2024"
  }'
```

### 4. Test Downtime Workflow
```bash
# Create downtime
curl -X POST http://localhost:8000/api/downtimes/ \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "equipment": 1,
    "start_time": "2026-02-07T10:00:00Z",
    "description": "Engine failure",
    "cause": "mechanical",
    "section": "Canaan"
  }'

# Start repair
curl -X POST http://localhost:8000/api/downtimes/1/start_repair/ \
  -H "Authorization: Bearer <token>"

# Close downtime
curl -X POST http://localhost:8000/api/downtimes/1/close_downtime/ \
  -H "Authorization: Bearer <token>"
```

---

## 9. IMPORTANT NOTES

### Security
- Only superusers can create users and equipment
- Passwords stored using Django's password hashing
- JWT tokens used for API authentication
- Tokens expire and can be refreshed

### Data Integrity
- Equipment status auto-updates when downtimes are created/closed
- Repair information automatically tracked with timestamps
- MTTR calculated from actual completed repairs

###Frontend/Backend Compatibility
- Frontend updated to use new field names
- Login accepts "name" instead of "username"
- All metrics endpoints return real calculated data

---

## 10. NEXT STEPS (Optional Enhancements)

1. **Admin Dashboard**: Create superuser-only page to manage users and equipment
2. **Repair History**: Add ability to view historical repairs
3. **Email Notifications**: Send alerts when equipment goes down
4. **Export Reports**: Generate PDF/CSV reports of downtime data
5. **Mobile App**: Create mobile-friendly version for on-site usage
6. **Predictive Maintenance**: Use historical data to predict failures

---

## File Changes Summary

### Backend (Django)
- `accounts/models.py` - Enhanced User model
- `accounts/serializers.py` - Updated serializers with new fields
- `accounts/views.py` - Added user management views
- `accounts/urls.py` - Added new endpoints
- `equipment/models.py` - Enhanced Equipment model
- `equipment/views.py` - Added update_status action
- `downtime/models.py` - Updated Downtime/Repair models
- `downtime/views.py` - Added repair workflow endpoints
- `downtime/serializers.py` - Updated with new fields

### Frontend (React)
- `pages/Login.tsx` - Updated login form
- `pages/Dashboard.tsx` - Use real metrics
- `contexts/AuthContext.tsx` - Handle new login format
- `hooks/useDowntimes.ts` - New methods for repair workflow
- `hooks/useRepairs.ts` - Updated repair endpoints
- `hooks/useMetrics.ts` - Enhanced metrics fetching
- `components/ui/status-badge.tsx` - Fixed bug, added under_repair
- `components/dashboard/DowntimeByCauseChart.tsx` - Use real data
- `components/dashboard/MonthlyTrendsChart.tsx` - Use real data
- `components/downtime/CloseDowntimeDialog.tsx` - Actual API calls

### Database Migrations
- `accounts/migrations/0002_update_user_fields.py`
- `equipment/migrations/0002_update_equipment_fields.py`
- `downtime/migrations/0002_update_downtime_models.py`

---

Last Updated: February 7, 2026
Status: Ready for Production
