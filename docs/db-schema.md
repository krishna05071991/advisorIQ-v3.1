# AdvisorIQ Database Schema Documentation

## Overview

This document provides comprehensive documentation of the AdvisorIQ database schema, explaining the architecture, relationships, security model, and business logic behind each table and component.

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Core Tables](#core-tables)
3. [Security Model (RLS Policies)](#security-model-rls-policies)
4. [Data Relationships](#data-relationships)
5. [Performance Optimizations](#performance-optimizations)
6. [Business Logic & Workflows](#business-logic--workflows)

---

## Architecture Overview

The AdvisorIQ database follows a **multi-tenant, role-based architecture** designed to support two primary user types:

- **Operations Staff (Admin)**: Full access to manage advisors and oversee all recommendations
- **Advisors**: Limited access to their own data and recommendations

### Design Principles

1. **Security First**: Row Level Security (RLS) is enabled on all tables
2. **Data Integrity**: Comprehensive constraints and foreign keys ensure data consistency
3. **Scalability**: Proper indexing and normalized structure for performance
4. **Audit Trail**: All tables include `created_at` and `updated_at` timestamps
5. **Separation of Concerns**: Clear separation between authentication, profile data, and business logic

---

## Core Tables

### 1. `user_profiles`

**Purpose**: Central authentication and role management table that extends Supabase's built-in `auth.users` table.

**Why This Table Exists**:
- Supabase's `auth.users` table handles authentication but lacks business-specific fields
- We need custom roles (`admin`, `advisor`) for application logic
- Provides a clean separation between authentication and application data
- Enables custom user metadata while leveraging Supabase Auth

#### Fields

| Field | Type | Purpose | Constraints |
|-------|------|---------|-------------|
| `id` | uuid | Primary key, references `auth.users.id` | NOT NULL, PRIMARY KEY |
| `email` | text | User's email address | NOT NULL, UNIQUE |
| `full_name` | text | User's display name | NOT NULL |
| `role` | text | User's role in the system | NOT NULL, CHECK (admin OR advisor) |
| `created_at` | timestamptz | Account creation timestamp | DEFAULT now() |
| `updated_at` | timestamptz | Last modification timestamp | DEFAULT now() |

#### RLS Policies

1. **`admin_read_all_profiles`** (SELECT)
   - **Who**: Admin users (`email() = 'admin@gmail.com'`)
   - **Why**: Operations staff need to see all user profiles for management

2. **`admin_update_all_profiles`** (UPDATE)
   - **Who**: Admin users only
   - **Why**: Only operations can modify user roles and profiles

3. **`users_read_own_profile`** (SELECT)
   - **Who**: Authenticated users (`uid() = id`)
   - **Why**: Users should see their own profile information

4. **`users_update_own_profile`** (UPDATE)
   - **Who**: Authenticated users (own profile only)
   - **Why**: Users can update their own display name and non-critical fields

#### Constraints & Indexes

- **PRIMARY KEY**: `id` (uuid)
- **UNIQUE**: `email` (prevents duplicate accounts)
- **CHECK**: `role IN ('admin', 'advisor')` (enforces valid roles)
- **FOREIGN KEY**: `id` → `auth.users.id` ON DELETE CASCADE
- **INDEX**: `idx_user_profiles_role` (for role-based queries)

---

### 2. `advisors`

**Purpose**: Extended profile information specific to advisor users, containing business-relevant details.

**Why This Table Exists**:
- Advisors need additional profile fields beyond basic user data
- Enables advisor-specific features like specialization and bio
- Allows for advisor management and discovery
- Separates advisor business logic from authentication logic
- Supports advisor performance tracking and client-facing profiles

#### Fields

| Field | Type | Purpose | Constraints |
|-------|------|---------|-------------|
| `id` | uuid | Primary key | NOT NULL, PRIMARY KEY, DEFAULT gen_random_uuid() |
| `user_id` | uuid | Links to user_profiles table | NULLABLE, FK to user_profiles.id |
| `name` | text | Advisor's professional name | NOT NULL |
| `email` | text | Advisor's contact email | NOT NULL, UNIQUE |
| `phone` | text | Contact phone number | NULLABLE |
| `bio` | text | Professional biography | NULLABLE |
| `specialization` | text | Investment specialization area | NULLABLE |
| `profile_image_url` | text | Avatar/profile image URL | NULLABLE |
| `is_active` | boolean | Whether advisor is currently active | DEFAULT true |
| `created_at` | timestamptz | Profile creation timestamp | DEFAULT now() |
| `updated_at` | timestamptz | Last modification timestamp | DEFAULT now() |

#### RLS Policies

1. **`admin_manage_advisors`** (ALL)
   - **Who**: Admin users (EXISTS check on user_profiles)
   - **Why**: Operations staff need full CRUD access to manage advisor profiles

2. **`advisors_own_record`** (ALL)
   - **Who**: Advisors (`user_id = uid()`)
   - **Why**: Advisors can view and update their own profile information

#### Business Logic

- **Automatic Creation**: When a user with role 'advisor' signs up, an advisor record is automatically created via application logic
- **Profile Completeness**: Advisors are encouraged to complete their bio and specialization for better client engagement
- **Active Status**: `is_active` flag allows soft deletion and advisor management

#### Constraints & Indexes

- **PRIMARY KEY**: `id`
- **UNIQUE**: `email`
- **FOREIGN KEY**: `user_id` → `user_profiles.id` ON DELETE SET NULL
- **INDEX**: `idx_advisors_user_id` (for user lookups)
- **INDEX**: `idx_advisors_active` (for filtering active advisors)

---

### 3. `recommendations`

**Purpose**: Core business entity storing investment recommendations made by advisors.

**Why This Table Exists**:
- Central repository for all investment advice and decisions
- Enables performance tracking and success rate calculations
- Provides audit trail for recommendation outcomes
- Supports client reporting and advisor evaluation
- Forms the basis for analytics and performance metrics

#### Fields

| Field | Type | Purpose | Constraints |
|-------|------|---------|-------------|
| `id` | uuid | Primary key | NOT NULL, PRIMARY KEY, DEFAULT gen_random_uuid() |
| `advisor_id` | uuid | Advisor who made recommendation | NOT NULL, FK to advisors.id |
| `stock_symbol` | text | Stock ticker symbol (e.g., AAPL) | NOT NULL |
| `action` | text | Recommended action | NOT NULL, CHECK (buy/sell/hold) |
| `target_price` | numeric(10,2) | Target price for the stock | NULLABLE |
| `reasoning` | text | Detailed reasoning for recommendation | NOT NULL |
| `confidence_level` | integer | Confidence level (1-5 scale) | CHECK (1-5), NULLABLE |
| `recommendation_date` | date | Date recommendation was made | NOT NULL, DEFAULT CURRENT_DATE |
| `status` | text | Current status of recommendation | DEFAULT 'ongoing', CHECK (ongoing/successful/unsuccessful) |
| `timeframe` | integer | Recommendation timeframe in months | NOT NULL, DEFAULT 3, CHECK (3/6/12) |
| `created_at` | timestamptz | Record creation timestamp | DEFAULT now() |
| `updated_at` | timestamptz | Last modification timestamp | DEFAULT now() |

#### RLS Policies

1. **`admin_manage_recommendations`** (ALL)
   - **Who**: Admin users
   - **Why**: Operations staff need to review and manage all recommendations for oversight

2. **`advisors_own_recommendations`** (ALL)
   - **Who**: Advisors (recommendation.advisor_id matches their advisor record)
   - **Why**: Advisors can only see and modify their own recommendations

#### Business Logic

- **Lifecycle**: Recommendations start as 'ongoing' and are later marked as 'successful' or 'unsuccessful'
- **Performance Tracking**: Status changes drive performance calculations
- **Timeframes**: Standardized timeframes (3, 6, 12 months) enable consistent evaluation
- **Confidence Scoring**: 1-5 scale helps assess advisor confidence and track correlation with success

#### Constraints & Indexes

- **PRIMARY KEY**: `id`
- **FOREIGN KEY**: `advisor_id` → `advisors.id` ON DELETE CASCADE
- **CHECK**: `action IN ('buy', 'sell', 'hold')`
- **CHECK**: `confidence_level BETWEEN 1 AND 5`
- **CHECK**: `status IN ('ongoing', 'successful', 'unsuccessful')`
- **CHECK**: `timeframe IN (3, 6, 12)`
- **INDEX**: `idx_recommendations_advisor_id` (for advisor queries)
- **INDEX**: `idx_recommendations_date` (for time-based queries)
- **INDEX**: `idx_recommendations_status` (for status filtering)
- **INDEX**: `idx_recommendations_stock_symbol` (for stock-based queries)

---

### 4. `advisor_performance`

**Purpose**: Aggregated performance metrics for each advisor, calculated from their recommendation outcomes.

**Why This Table Exists**:
- Provides quick access to performance metrics without expensive calculations
- Enables efficient ranking and comparison of advisors
- Supports dashboard and analytics features
- Caches computationally expensive aggregations
- Enables performance-based reporting and evaluation

#### Fields

| Field | Type | Purpose | Constraints |
|-------|------|---------|-------------|
| `id` | uuid | Primary key | NOT NULL, PRIMARY KEY, DEFAULT gen_random_uuid() |
| `advisor_id` | uuid | Reference to advisor | NOT NULL, UNIQUE, FK to advisors.id |
| `total_recommendations` | integer | Total recommendations made | DEFAULT 0 |
| `successful_recommendations` | integer | Number of successful recommendations | DEFAULT 0 |
| `success_rate` | numeric(5,2) | Success rate percentage | DEFAULT 0 |
| `last_calculated` | timestamptz | When metrics were last updated | DEFAULT now() |

#### RLS Policies

1. **`admin_view_all_performance`** (SELECT)
   - **Who**: Admin users
   - **Why**: Operations need to see all advisor performance for management decisions

2. **`admin_manage_performance`** (INSERT)
   - **Who**: Admin users
   - **Why**: Only operations can create new performance records

3. **`admin_update_performance`** (UPDATE)
   - **Who**: Admin users
   - **Why**: Only operations can update performance metrics

4. **`advisors_own_performance`** (SELECT)
   - **Who**: Advisors (their own performance only)
   - **Why**: Advisors should see their own performance metrics

#### Business Logic

- **Materialized View Pattern**: Pre-calculated metrics for performance
- **Automatic Updates**: Application logic updates these metrics when recommendation statuses change
- **Unique Constraint**: One performance record per advisor
- **Calculation Timestamp**: Tracks when metrics were last updated for cache invalidation

#### Constraints & Indexes

- **PRIMARY KEY**: `id`
- **UNIQUE**: `advisor_id`
- **FOREIGN KEY**: `advisor_id` → `advisors.id` ON DELETE CASCADE
- **INDEX**: `idx_performance_advisor_id` (for advisor lookups)

---

## Security Model (RLS Policies)

### Overview

All tables use Row Level Security (RLS) to ensure data isolation and proper access control. The security model is built around two core principles:

1. **Role-Based Access**: Admin users have broader access, advisors have limited access
2. **Data Ownership**: Users can only access data they own or are authorized to see

### Policy Pattern

All policies follow a consistent pattern:

```sql
-- Admin policies: Full access for operations staff
CREATE POLICY "admin_[action]_[table]" ON [table]
  FOR [SELECT|INSERT|UPDATE|DELETE] TO authenticated
  USING (EXISTS (
    SELECT 1 FROM user_profiles 
    WHERE user_profiles.id = auth.uid() 
    AND user_profiles.role = 'admin'
  ));

-- User policies: Limited access to own data
CREATE POLICY "[users]_[action]_own_[data]" ON [table]
  FOR [SELECT|INSERT|UPDATE|DELETE] TO authenticated
  USING ([ownership_condition]);
```

### Security Benefits

1. **Database-Level Security**: Even if application logic fails, data remains secure
2. **Zero Trust**: No implicit access, all access must be explicitly granted
3. **Audit Trail**: All access is logged and traceable
4. **Scalability**: Policies scale automatically with user growth

---

## Data Relationships

### Entity Relationship Overview

```
auth.users (Supabase)
    ↓ 1:1
user_profiles
    ↓ 1:0..1
advisors
    ↓ 1:many
recommendations

advisors
    ↓ 1:1
advisor_performance
```

### Relationship Details

1. **auth.users → user_profiles**: 1:1 relationship extending Supabase auth
2. **user_profiles → advisors**: 1:0..1 relationship (only advisor role users have advisor records)
3. **advisors → recommendations**: 1:many relationship (advisors create multiple recommendations)
4. **advisors → advisor_performance**: 1:1 relationship (one performance record per advisor)

### Foreign Key Behaviors

- **CASCADE DELETE**: When user is deleted, all related data is removed
- **SET NULL**: Some relationships use SET NULL to preserve data integrity
- **RESTRICT**: Critical relationships prevent deletion if dependencies exist

---

## Performance Optimizations

### Indexing Strategy

1. **Primary Keys**: Automatic B-tree indexes on all primary keys
2. **Foreign Keys**: Indexes on all foreign key columns for join performance
3. **Query Patterns**: Indexes on commonly filtered columns (status, date, role)
4. **Composite Indexes**: Multi-column indexes for complex queries

### Query Optimization

1. **Materialized Metrics**: `advisor_performance` table caches expensive calculations
2. **Selective Columns**: Queries only select needed columns
3. **Proper Joins**: Efficient join patterns with proper index usage
4. **Date Partitioning**: Time-based queries use date indexes

### Caching Strategy

1. **Application Level**: React hooks cache frequently accessed data
2. **Database Level**: Performance metrics are pre-calculated
3. **CDN Level**: Static assets and images use CDN caching

---

## Business Logic & Workflows

### User Registration Flow

1. User signs up via Supabase Auth
2. `user_profiles` record created with role assignment
3. If role is 'advisor', `advisors` record automatically created
4. User can complete profile information

### Recommendation Lifecycle

1. **Creation**: Advisor creates recommendation with 'ongoing' status
2. **Monitoring**: Recommendation tracked over specified timeframe
3. **Evaluation**: Status updated to 'successful' or 'unsuccessful'
4. **Performance Update**: Advisor performance metrics recalculated

### Performance Calculation

1. **Triggered Events**: Recommendation status changes
2. **Aggregation**: Count total, successful, and unsuccessful recommendations
3. **Rate Calculation**: Success rate = successful / total * 100
4. **Cache Update**: `advisor_performance` table updated with new metrics

### Data Integrity Workflows

1. **Automatic Timestamps**: `created_at` and `updated_at` maintained via triggers
2. **Constraint Validation**: CHECK constraints ensure data quality
3. **Referential Integrity**: Foreign keys maintain relationship consistency
4. **Soft Deletion**: `is_active` flags allow logical deletion without data loss

---

## Migration and Maintenance

### Schema Evolution

1. **Migration Files**: All schema changes tracked in migration files
2. **Backward Compatibility**: Changes maintain compatibility where possible
3. **Data Preservation**: No destructive operations in migrations
4. **Rollback Strategy**: All migrations can be safely rolled back

### Monitoring and Maintenance

1. **Performance Monitoring**: Query performance tracked and optimized
2. **Index Usage**: Regular analysis of index effectiveness
3. **Data Growth**: Monitoring table sizes and planning for scale
4. **Security Audits**: Regular review of RLS policies and access patterns

---

## Conclusion

This schema design provides a solid foundation for the AdvisorIQ platform with:

- **Security**: Comprehensive RLS policies ensure data protection
- **Scalability**: Proper indexing and normalization support growth
- **Maintainability**: Clear separation of concerns and consistent patterns
- **Performance**: Optimized for common query patterns and use cases
- **Flexibility**: Extensible design allows for future feature additions

The schema effectively balances security, performance, and maintainability while providing the data foundation needed for a professional financial advisory platform.