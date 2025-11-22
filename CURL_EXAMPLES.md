# cURL Examples for TinyLink API

This document provides cURL examples for testing all API endpoints.

**Base URL**: `http://localhost:3000` (replace with your production URL if testing deployed app)

---

## 1. Health Check

### GET /healthz

```bash
curl -X GET http://localhost:3000/healthz
```

**Expected Response (200):**
```json
{
  "ok": true,
  "version": "1.0"
}
```

---

## 2. Create Link (Auto-generated Code)

### POST /api/links

```bash
curl -X POST http://localhost:3000/api/links \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://example.com"
  }'
```

**Expected Response (201):**
```json
{
  "id": "clx1234567890",
  "code": "aBc123Xy",
  "url": "https://example.com",
  "clicks": 0,
  "createdAt": "2024-01-15T10:30:00.000Z",
  "lastClicked": null
}
```

---

## 3. Create Link (Custom Code)

### POST /api/links

```bash
curl -X POST http://localhost:3000/api/links \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://google.com",
    "code": "google1"
  }'
```

**Expected Response (201):**
```json
{
  "id": "clx1234567891",
  "code": "google1",
  "url": "https://google.com",
  "clicks": 0,
  "createdAt": "2024-01-15T10:31:00.000Z",
  "lastClicked": null
}
```

---

## 4. Create Link with Duplicate Code (409 Error)

### POST /api/links

```bash
curl -X POST http://localhost:3000/api/links \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://github.com",
    "code": "google1"
  }'
```

**Expected Response (409):**
```json
{
  "error": "Code already exists"
}
```

---

## 5. Create Link with Invalid Code Format (400 Error)

### POST /api/links

```bash
curl -X POST http://localhost:3000/api/links \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://github.com",
    "code": "abc"
  }'
```

**Expected Response (400):**
```json
{
  "error": "Code must be 6-8 alphanumeric characters"
}
```

---

## 6. Create Link with Invalid URL (400 Error)

### POST /api/links

```bash
curl -X POST http://localhost:3000/api/links \
  -H "Content-Type: application/json" \
  -d '{
    "url": "not-a-valid-url",
    "code": "test123"
  }'
```

**Expected Response (400):**
```json
{
  "error": "Please enter a valid URL"
}
```

---

## 7. List All Links

### GET /api/links

```bash
curl -X GET http://localhost:3000/api/links
```

**Expected Response (200):**
```json
[
  {
    "id": "clx1234567890",
    "code": "aBc123Xy",
    "url": "https://example.com",
    "clicks": 3,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "lastClicked": "2024-01-15T11:00:00.000Z"
  },
  {
    "id": "clx1234567891",
    "code": "google1",
    "url": "https://google.com",
    "clicks": 0,
    "createdAt": "2024-01-15T10:31:00.000Z",
    "lastClicked": null
  }
]
```

---

## 8. Get Link Stats

### GET /api/links/:code

```bash
curl -X GET http://localhost:3000/api/links/google1
```

**Expected Response (200):**
```json
{
  "id": "clx1234567891",
  "code": "google1",
  "url": "https://google.com",
  "clicks": 5,
  "createdAt": "2024-01-15T10:31:00.000Z",
  "lastClicked": "2024-01-15T12:00:00.000Z"
}
```

---

## 9. Get Non-existent Link (404 Error)

### GET /api/links/:code

```bash
curl -X GET http://localhost:3000/api/links/nonexist
```

**Expected Response (404):**
```json
{
  "error": "Link not found"
}
```

---

## 10. Delete Link

### DELETE /api/links/:code

```bash
curl -X DELETE http://localhost:3000/api/links/google1
```

**Expected Response (200):**
```json
{
  "message": "Link deleted successfully"
}
```

---

## 11. Delete Non-existent Link (404 Error)

### DELETE /api/links/:code

```bash
curl -X DELETE http://localhost:3000/api/links/nonexist
```

**Expected Response (404):**
```json
{
  "error": "Link not found"
}
```

---

## 12. Test Redirect (302)

### GET /:code

```bash
curl -I http://localhost:3000/aBc123Xy
```

**Expected Response (302):**
```
HTTP/1.1 302 Found
Location: https://example.com
```

**Note:** Use `-I` flag to see headers only, or `-L` to follow redirects.

---

## 13. Test Redirect After Deletion (404)

After deleting a link, test the redirect:

```bash
curl -I http://localhost:3000/google1
```

**Expected Response (404):**
```
HTTP/1.1 404 Not Found
```

**Response Body:**
```json
{
  "error": "Link not found"
}
```

---

## Testing Workflow

1. **Health Check**: Verify server is running
   ```bash
   curl http://localhost:3000/healthz
   ```

2. **Create Links**: Create a few test links
   ```bash
   curl -X POST http://localhost:3000/api/links -H "Content-Type: application/json" -d '{"url": "https://example.com"}'
   ```

3. **List Links**: Verify links were created
   ```bash
   curl http://localhost:3000/api/links
   ```

4. **Test Redirect**: Visit a short link (this increments clicks)
   ```bash
   curl -L http://localhost:3000/YOUR_CODE
   ```

5. **Check Stats**: Verify click count increased
   ```bash
   curl http://localhost:3000/api/links/YOUR_CODE
   ```

6. **Delete Link**: Remove a link
   ```bash
   curl -X DELETE http://localhost:3000/api/links/YOUR_CODE
   ```

7. **Verify Deletion**: Confirm redirect returns 404
   ```bash
   curl -I http://localhost:3000/YOUR_CODE
   ```

---

## Pretty Print JSON Responses

Add `| jq` to format JSON responses (requires `jq` to be installed):

```bash
curl -X GET http://localhost:3000/api/links | jq
```

Or use Python:

```bash
curl -X GET http://localhost:3000/api/links | python -m json.tool
```

