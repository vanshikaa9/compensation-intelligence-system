# Compensation Intelligence System

A production-grade compensation intelligence platform inspired by Levels.fyi, built for structured, comparable, decision-ready salary insights across India tech roles.

Live Demo: [https://compensation-intelligence-system-nu.vercel.app](https://compensation-intelligence-system-nu.vercel.app)

---

## Overview

Traditional salary platforms focus heavily on job titles.

This system is built around a different principle:

> Compensation is tied to levels, not titles.

An L5 at Google is not equivalent to every "Senior Engineer" role across companies.
The platform standardizes compensation data around levels, making salaries genuinely comparable.

---

## Core Product Principles

* Structured salary intelligence
* Level-based normalization
* Queryable compensation data
* Comparable compensation breakdowns
* Decision-ready insights

This is not a salary listing website.
It is a compensation intelligence system.

---

## Features

### Home Page

* Clear positioning around level-standardized compensation
* Compensation intelligence overview
* Navigation across core modules
* Real-time metrics display

### Salary Table

* API-driven salary table
* Filter by:

  * company
  * role
  * level
  * location
* Server-side sorting
* Compensation breakdown visibility
* Compare-ready selection system

### Company Insights

* Median compensation calculation
* Level distribution analysis
* Role distribution visualization
* Company-specific compensation intelligence

### Compare System

* Side-by-side salary comparison
* Base / bonus / stock breakdown
* Total compensation comparison
* Level comparison
* AI-generated compensation insights

### Salary Submission

* Strict backend validation
* Automatic compensation calculation
* Duplicate rejection
* Company normalization
* Anonymous structured submissions

---

## Tech Stack

### Frontend

* Next.js 14
* React
* TypeScript
* Tailwind CSS

### Backend

* Next.js API Routes
* Prisma ORM
* SQLite

### AI Integration

* Anthropic Claude API

### Deployment

* Vercel

---

## Database Design

### Salary Model

```prisma
model Salary {
  id                  Int      @id @default(autoincrement())
  company             String
  role                String
  level               String
  location            String
  experience_years    Int
  base_salary         Int
  bonus               Int
  stock               Int
  total_compensation  Int
  confidence_score    Float
  createdAt           DateTime @default(now())
}
```

---

## API Endpoints

### GET /api/salaries

Returns salary entries with filtering and sorting support.

### POST /api/ingest-salary

Validates and stores salary submissions.

### POST /api/insight

Generates AI-powered compensation insights for salary comparisons.

---

## Edge Cases Handled

* Missing bonus or stock defaults to 0
* Duplicate salary entries rejected
* Company normalization:

  * "Google"
  * " google "
  * "GOOGLE"
    are treated as the same company
* Invalid payload rejection
* Server-side validation
* Computed total compensation enforcement

---

## System Architecture

```text
Frontend UI
   ↓
Next.js API Routes
   ↓
Prisma ORM
   ↓
SQLite Database
```

---

## Local Setup

### Clone Repository

```bash
git clone https://github.com/vanshikaa9/compensation-intelligence-system.git
cd compensation-intelligence-system
```

### Install Dependencies

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

### Open

```text
http://localhost:3000
```

---

## Build Verification

Production build tested successfully using:

```bash
npm run build
```

---

## Design Direction

The interface follows a clean white and royal-blue visual system inspired by modern intelligence dashboards.

Typography focuses on:

* strong hierarchy
* structured readability
* minimal noise
* product-first UI

---

## What This Project Demonstrates

* Full-stack product development
* API architecture
* Database modeling
* Prisma integration
* Data normalization
* Server-side validation
* Production deployment
* AI integration
* Queryable structured systems
* Product thinking under ambiguity

---

## Future Improvements

* PostgreSQL migration
* Authentication
* Advanced analytics
* Salary trend visualization
* Better normalization pipelines
* Confidence scoring improvements
* Caching layer
* Search optimization

---

## Author

Vanshika Mishra

GitHub: [https://github.com/vanshikaa9](https://github.com/vanshikaa9)
