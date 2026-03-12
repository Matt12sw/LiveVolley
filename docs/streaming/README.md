# 📡 Streaming Architecture

Live streaming est essentiel pour LiveVolley. Voici comment c'est organisé.

## Architecture du Streaming

```
┌──────────────────┐
│   Camera/Device  │
└────────┬─────────┘
         │ RTMP
         ↓
┌──────────────────────────┐
│   RTMP Ingest Server     │
│   (nginx-rtmp)           │
└─────┬──────────────┬─────┘
      │              │
      │ HLS          │ Recording
      ↓              ↓
┌──────────────┐  ┌──────────┐
│ CDN / Cache  │  │ Storage  │
└─────┬────────┘  └──────────┘
      │
      ↓
┌──────────────────┐
│  Web Player      │
│  (Video.js/HLS)  │
└──────────────────┘
```

## Stack Streaming

### Ingestion (RTMP)
- **nginx-rtmp** pour l'ingestion RTMP
- **rtmp://localhost:1935/live/{stream-key}**
- Qualité 720p / 1080p
- Bitrate: 2500kbps - 5000kbps

### Output (HLS)
- **HTTP Live Streaming (HLS)**
- Segments de 10 secondes
- Playlist adaptive
- Qualités: 360p, 480p, 720p, 1080p
- **http://localhost:8080/hls/{stream-key}/index.m3u8**

### Playback
- **Video.js** (web)
- HLS.js for fallback
- Adaptive bitrate streaming
- Resume capability

### Recording
- Segments automatiquement enregistrés
- Stockage S3 pour VOD (Video on Demand)
- Archive 30 jours minimum

## Configuration nginx-rtmp

```nginx
rtmp {
    server {
        listen 1935;
        chunk_size 4096;

        application live {
            live on;
            record all;
            record_path /tmp/hls;
            record_format flv;

            # Push to HLS
            exec_static /usr/local/bin/ffmpeg 
              -i rtmp://localhost/live/$name 
              -vcodec libx264 
              -vprofile main 
              -preset veryfast 
              -maxrate 2500k 
              -bufsize 5000k 
              -f hls 
              /tmp/hls/$name.m3u8;
        }

        # HLS endpoint
        application hls {
            live on;
            hls on;
            hls_path /tmp/hls;
            hls_fragment 10;
            hls_playlist_length 60;
        }
    }
}
```

## API Endpoints

### Créer une session de streaming

```http
POST /api/matches/{id}/streaming
Content-Type: application/json

{
  "title": "Finales - Volleyball Club A vs Club B",
  "description": "Match final de la saison 2024"
}
```

Réponse:
```json
{
  "id": "streaming_123",
  "matchId": "match_456",
  "rtmpIngestUrl": "rtmp://streaming.livevolley.com/live/abc123xyz",
  "hlsPlaybackUrl": "https://cdn.livevolley.com/hls/abc123xyz/index.m3u8",
  "status": "SETUP"
}
```

### Démarrer le streaming

```http
POST /api/streaming/{id}/start
```

### Arrêter le streaming

```http
POST /api/streaming/{id}/stop
```

### Récupérer les viewers

```http
GET /api/streaming/{id}/viewers

Response:
{
  "viewers": 1250,
  "peak": 2100,
  "duration": 3600
}
```

## WebSocket Events

### On Match Start
```ts
socket.emit('streaming:start', {
  matchId: 'match_123',
  hlsUrl: 'https://cdn.../index.m3u8'
});
```

### On Viewers Update
```ts
socket.on('streaming:viewers', {
  viewers: 1250,
  timestamp: '...'
});
```

### On Recording Complete
```ts
socket.emit('streaming:recorded', {
  recordingUrl: 'https://s3.../recording.mp4',
  duration: 7200
});
```

## Performance & Reliability

### Latency Goals
- Live ingestion → HLS: < 5 seconds delay
- HLS → Playback: < 3 seconds
- Total latency: < 15 seconds

### Quality Adaptation
```
Internet Speed → Bitrate Decision
0-1 Mbps      → 360p (500kbps)
1-2.5 Mbps    → 480p (1000kbps)
2.5-5 Mbps    → 720p (2500kbps)
> 5 Mbps      → 1080p (4500kbps)
```

### Failover & Backup
- Multiple encoding servers
- Automatic fall-back to lower quality
- Recording continues if streaming fails
- Manual intervention available

## VOD (Video On Demand)

Après le match:
1. Recording finalisé
2. Transcoding multi-bitrate
3. Upload vers S3/CDN
4. Disponible dans "Past Broadcasts"

```
https://vod.livevolley.com/matches/{matchId}/video.m3u8
```

## Monitoring

### Metrics
- RTMP connections
- HLS viewers
- Average bitrate
- Buffering events
- Errors/Disconnections
- Recording status

### Alerts
- Ingestion down
- Recording disk full
- High viewer count
- Bitrate issues

## OBS Configuration

Streamers utilisent OBS Studio:

**Stream Settings:**
- Server: `rtmp://streaming.livevolley.com/live`
- Stream Key: Get from dashboard
- Bitrate: 4000-6000 kbps (recommended)
- Resolution: 1920x1080 @ 60fps

**Output Settings:**
- Encoder: Hardware (H.264/NVIDIA/Intel)
- Video Bitrate: 4500 kbps
- Keyframe Interval: 2s
- CPU Usage: Preset = Fast

## Troubleshooting

### No stream signal
- Vérifier RTMP URL
- Vérifier stream key
- Vérifier firewall port 1935

### Lag/Buffering
- Réduire bitrate
- Vérifier connexion internet
- Réduire latence HLS buffer

### Recording not starting
- Vérifier disk space `/tmp/hls`
- Vérifier permissions
- Vérifier nginx-rtmp service

## References

- [NGINX RTMP Module](https://github.com/arut/nginx-rtmp-module)
- [HLS Specification](https://tools.ietf.org/html/draft-pantos-http-live-streaming)
- [Video.js Documentation](https://docs.videojs.com)
