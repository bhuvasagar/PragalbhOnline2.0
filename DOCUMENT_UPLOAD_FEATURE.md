# Document Upload Feature - Implementation Summary

## Overview
The document upload feature has been successfully integrated into your application. Users can now upload PDF and image files (JPG, PNG) when applying for services. These files are stored on the server with the user's name and phone number, and are accessible to the admin panel.

## Frontend Changes

### ServiceApplicationModal.tsx
**File**: `/workspaces/PragalbhOnline2.0/Frontend/components/ServiceApplicationModal.tsx`

#### New Features:
1. **File Upload Input**
   - Drag-and-drop enabled dashed border UI
   - Accepts PDF, JPG, and PNG files
   - Maximum file size: 10MB per file
   - Maximum files: 5 documents per application

2. **File Validation**
   - Validates file types (only PDF and images allowed)
   - Validates file size (prevents uploads > 10MB)
   - Validates file count (max 5 files)
   - Displays clear error messages for invalid files

3. **File Management**
   - Visual file list with icons (red for PDF, blue for images)
   - Remove button for each uploaded file
   - Real-time file counter display (e.g., "2/5")

4. **Form Submission**
   - Updated to use FormData for multipart/form-data submission
   - Sends files along with customer info to backend
   - Clears uploaded files after successful submission

## Backend Changes

### 1. Updated Application Model
**File**: `/workspaces/PragalbhOnline2.0/Backend/src/models/Application.ts`

```typescript
// New Document interface for storing file metadata
export interface IDocument {
  originalName: string;      // Original file name
  filename: string;          // Server filename (includes user name & phone)
  mimeType: string;          // File type (application/pdf, image/jpeg, etc.)
  size: number;              // File size in bytes
  uploadedAt: Date;          // Upload timestamp
}

// Updated Application interface includes documents array
documents: IDocument[];
```

### 2. Created Multer Configuration
**File**: `/workspaces/PragalbhOnline2.0/Backend/src/config/multer.ts`

Features:
- Custom file naming: `{customerName}_{phone}_{timestamp}{extension}`
- Automatic uploads directory creation
- File type validation (PDF and images only)
- File size limit: 10MB per file
- Maximum files: 5 per request

### 3. Updated Application Controller
**File**: `/workspaces/PragalbhOnline2.0/Backend/src/controllers/application.controller.ts`

- Modified `submitApplication` endpoint to handle file uploads
- Extracts file metadata from multer and stores in database
- Maintains backward compatibility with applications without files

### 4. Updated Application Routes
**File**: `/workspaces/PragalbhOnline2.0/Backend/src/routes/application.routes.ts`

```typescript
// File upload middleware added to POST route
router.route("/").post(upload.array("documents", 5), submitApplication)
```

### 5. Updated Server Configuration
**File**: `/workspaces/PragalbhOnline2.0/Backend/src/server.ts`

Added:
- Static file serving for uploads directory
- `/uploads` endpoint to access stored documents

### 6. Updated Package Dependencies
**File**: `/workspaces/PragalbhOnline2.0/Backend/package.json`

Added:
- `multer@^1.4.5-lts.1` - For file upload handling
- `@types/multer@^1.4.7` - TypeScript types for multer

### 7. Updated .gitignore
**File**: `/workspaces/PragalbhOnline2.0/Backend/.gitignore`

Added `uploads/` directory to prevent tracking uploaded files in git

## How It Works

1. **User uploads files**: User selects PDF or image files in the modal
   - Frontend validates file type and size
   - Shows preview of selected files with remove option

2. **Form submission**: 
   - Frontend sends FormData with customer info and files
   - Backend receives request with multer middleware

3. **File storage**:
   - Multer saves files to `Backend/uploads/` directory
   - Files are named: `{customerName}_{phone}_{timestamp}.{extension}`
   - Example: `John_Smith_1234567890_1704067200000.pdf`

4. **Database storage**:
   - Application document stores metadata about each file
   - Stores original filename, server filename, mime type, size, and upload time
   - Admin can view all uploaded documents for each application

5. **Access**:
   - Admin can access files via `/uploads/{filename}` endpoint
   - Files remain on server for admin review

## File Storage Structure

```
Backend/
├── uploads/
│   ├── John_Smith_9876543210_1704067200000.pdf
│   ├── John_Smith_9876543210_1704067201000.png
│   ├── Jane_Doe_9876543211_1704067202000.jpg
│   └── ...
├── src/
├── package.json
└── ...
```

## Database Structure (Application Document)

```json
{
  "_id": "...",
  "customerName": "John Smith",
  "phone": "9876543210",
  "serviceId": "...",
  "serviceName": "Service Name",
  "message": "...",
  "documents": [
    {
      "originalName": "resume.pdf",
      "filename": "John_Smith_9876543210_1704067200000.pdf",
      "mimeType": "application/pdf",
      "size": 245120,
      "uploadedAt": "2024-01-01T12:00:00.000Z"
    },
    {
      "originalName": "photo.jpg",
      "filename": "John_Smith_9876543210_1704067201000.jpg",
      "mimeType": "image/jpeg",
      "size": 512000,
      "uploadedAt": "2024-01-01T12:00:01.000Z"
    }
  ],
  "date": "2024-01-01T12:00:00.000Z",
  "status": "pending",
  "createdAt": "2024-01-01T12:00:00.000Z",
  "updatedAt": "2024-01-01T12:00:00.000Z"
}
```

## Installation Instructions

1. Install new backend dependencies:
   ```bash
   cd Backend
   npm install
   ```

2. No frontend dependencies need to be added (uses existing icons from lucide-react)

## Testing

1. Ensure multer and @types/multer are installed
2. Start the backend server: `npm run dev`
3. Try uploading files through the service application modal
4. Check the `Backend/uploads/` directory for stored files
5. Admin can view stored documents in their applications list

## Security Features

- File type validation (only PDF and images)
- File size limit (10MB)
- Files stored with user identification in filename
- Files served from specific upload directory
- Original filename preserved for reference

## Future Enhancements

- Add file download functionality for admins
- Add file preview in admin panel
- Implement file compression for images
- Add virus scanning for uploaded files
- Add file retention/cleanup policies
- Add download tracking and logging
