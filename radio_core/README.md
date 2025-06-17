# AI Radio Generator API

A Flask-based API for generating AI radio shows based on artist styles.

## Setup

1. Clone the repository
2. Install dependencies:
```bash
pip install -r requirements.txt
```
3. Run the server:
```bash
python backend/app.py
```

The server will start on `http://localhost:6000`

## API Endpoints

All endpoints are prefixed with `/api`

### Health Check
```http
GET /api/health
```
Response:
```json
{
    "status": "healthy"
}
```

### Artist Endpoints

#### Get All Artists
```http
GET /api/artists
```
Response:
```json
{
    "artists": ["artist1", "artist2", ...]
}
```

#### Get Artist Songs
```http
GET /api/artists/{artist_name}/songs
```
Response:
```json
{
    "songs": [
        {
            "name": "song1",
            "duration": "3:45",
            ...
        },
        ...
    ]
}
```

#### Get Artists with Songs
```http
GET /api/artists-with-songs
```
Returns up to 5 artists with their songs.
Response:
```json
{
    "artists": [
        {
            "artist": "artist1",
            "songs": ["song1", "song2", ...]
        },
        ...
    ]
}
```

### Task Management

#### Start Radio Generation
```http
POST /api/start-generation
```
Request Body:
```json
{
    "artist_name": "artist_name",
    "enable_dj_transitions": false
}
```
Response:
```json
{
    "message": "Radio generation started in background",
    "task_id": "task_123",
    "status": "pending"
}
```

#### Get Task Status
```http
GET /api/task-status/{task_id}
```
Response:
```json
{
    "status": "in_progress",
    "progress": 45,
    "current_step": "Generating audio segment 2/5"
}
```

#### Get Task Logs
```http
GET /api/task-log/{task_id}
```
Response:
```json
{
    "log": "Detailed task execution log..."
}
```

#### Get Task Output
```http
GET /api/task-output/{task_id}
```
Returns the generated audio file if task is completed.

### File Serving

#### Get Audio File
```http
GET /api/audio/{filename}
```
Streams an audio file from the cache directory.

#### Get Output File
```http
GET /api/output/{filename}
```
Downloads a generated output file.

## Error Responses

All error responses follow this format:
```json
{
    "error": "Error message description"
}
```

Common HTTP status codes:
- 200: Success
- 202: Accepted (Task started)
- 400: Bad Request
- 404: Not Found
- 409: Conflict (Task already running)
- 500: Internal Server Error

## Task States

Tasks can be in one of these states:
- `pending`: Task created but not started
- `in_progress`: Task is currently running
- `completed`: Task finished successfully
- `failed`: Task failed with error

## Features

- Generate AI-powered radio shows for any artist
- Background task processing with real-time progress tracking
- Detailed logging of the generation process
- DJ transitions between songs (optional)
- Automatic audio segment combination

## Generation Steps

1. Script Generation (10%)
2. Script Segmentation (30%)
3. Audio Generation (40-70%)
4. DJ Transitions (70-90%) - if enabled
5. Final Combination (90-100%)

## Setup and Installation

[Add setup instructions here]

## Configuration

[Add configuration details here]

## Development

[Add development instructions here] 