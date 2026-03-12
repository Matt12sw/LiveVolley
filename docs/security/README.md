# 🔐 Security & Best Practices

## Authentication & Authorization

### JWT Strategy
```typescript
// Token structure
{
  sub: userId,
  email: user.email,
  role: user.role,
  iat: issued_at,
  exp: expiration_time
}
```

### Token Expiration
- Access token: 15 minutes
- Refresh token: 7 days
- Remember me: 30 days

### Refresh Token Rotation
```typescript
// Après chaque refresh
- Ancien token révoqué
- Nouveau token émis
- Stocké en database
- Tracé pour audit
```

## Password Security

### Hashing
- Algorithm: bcrypt
- Rounds: 12
- Cost: ~200ms per hash

### Password Requirements
- Minimum 12 characters
- Uppercase, lowercase, numbers, symbols
- No common passwords (checked against dictionary)
- Unique per user

### Password Reset
1. User demande reset
2. Email de confirmation envoyé
3. Lien valide 1 heure
4. Nouveau password hasé
5. Tous les tokens invalidés

## API Security

### CORS
```typescript
app.enableCors({
  origin: [
    'https://livevolley.com',
    'https://admin.livevolley.com',
    'http://localhost:3000' // dev only
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']
});
```

### Rate Limiting
```typescript
// Par IP
- Login: 5 attempts / 15 min
- API: 100 requests / minute
- WebSocket: 50 messages / minute

// Par User
- Chat messages: 1 per second
- Score updates: 1 per second
- 
```

### Request Validation
```typescript
// Validation pipes
- Whitelist: Only defined properties
- Transform: Type coercion
- Forbid: Reject unknown properties
```

### HTTPS/TLS
- Only HTTPS in production
- TLS 1.3 minimum
- Perfect Forward Secrecy
- HSTS header enabled

## Data Protection

### Encryption at Rest
- Database: Column-level encryption for sensitive data
  - Passwords (bcrypt)
  - Personal data (AES-256)
  - Payment info (not stored - third-party)

### Encryption in Transit
- TLS 1.3 for HTTPS
- WSS (WebSocket Secure) for real-time
- HTTPS for API calls

### Data Retention
- User data: Until account deletion
- Chat messages: 90 days
- Audit logs: 1 year
- Streaming recordings: 30 days minimum

## WebSocket Security

### Connection Authentication
```typescript
socket.on('connect', async () => {
  // Verify JWT
  // Check user permissions
  // Rate limit connections
  // Log connection
});
```

### Message Validation
```typescript
// Chaque message validé:
- Authentification
- Authorization
- Input validation
- Rate limiting
- Anomaly detection
```

## Chat Moderation

### Content Filtering
- Regex patterns pour spam/abuse
- Profanity filter
- URL detection
- Duplicate detection

### User Moderation
- Mute: User (configurable duration)
- Ban: IP + Account
- Warn: System message
- Report: Manual review

### Automatic Flagging
```typescript
Message flagged if:
- Contains banned words
- Too many caps
- Excessive emojis
- URL shorteners
- Repeated messages
```

## SQL Injection Prevention

### Prisma ORM
- Parameterized queries
- No raw SQL (except necessary)
- Type-safe queries

```typescript
// ✅ Safe
const user = await prisma.user.findUnique({
  where: { id: userId }
});

// ❌ Unsafe (never do)
const user = await prisma.user.findRaw({
  filter: { $where: `this.id === "${userId}"` }
});
```

## XSS Protection

### Frontend
- DOMPurify for user content
- Content Security Policy headers
- Escape HTML entities
- No innerHTML with user data

### Backend
- Input validation (no HTML)
- Output encoding
- CSP headers

## CSRF Protection

### Token-based
```typescript
// Middleware
app.use(csrf({
  cookie: {
    httpOnly: true,
    secure: true,
    sameSite: 'strict'
  }
}));
```

### SameSite Cookies
```typescript
// All cookies
httpOnly: true,
secure: true,
sameSite: 'Strict' // or 'Lax'
```

## Logging & Monitoring

### What to Log
- Login attempts (success/failure)
- User actions (create, update, delete)
- Permission denied
- Errors
- Suspicious activity

### What NOT to Log
- Passwords
- Tokens
- Personal data
- Payment info

### Log Storage
```typescript
// Secure location:
- Separate server
- Encrypted
- Time-series DB
- Retention: 1 year
```

### Monitoring
- Failed login attempts (>5 = alert)
- Unusual activity patterns
- API error rates
- Performance degradation
- Disk space

## Third-party Security

### Dependencies
```bash
# Check for vulnerabilities
pnpm audit

# Update regularly
pnpm update

# Check supply chain
npm sbom
```

### API Keys & Secrets
```typescript
// Environment variables only
process.env.JWT_SECRET
process.env.AWS_SECRET_KEY
process.env.SENDGRID_API_KEY

// Rotation strategy
- 90 days rotation
- Previous key valid for grace period
- Alert on key usage
```

## Infrastructure Security

### Network
- Firewall rules
- VPN for admin access
- DDoS protection
- WAF (Web Application Firewall)

### Server
- Minimal services running
- Regular patching
- SSH key-based auth (no passwords)
- 2FA for admin access
- SELinux/AppArmor

### Database
- Backups encrypted
- Off-site storage
- Regular restore tests
- Access logs
- Network isolation

## Incident Response

### Procedures
1. Detection & Alert
2. Containment
3. Investigation
4. Remediation
5. Communication
6. Post-mortem

### Security Contacts
- Security email: security@livevolley.com
- Response time: 24 hours
- Bug bounty program

## Compliance

### GDPR
- Privacy policy
- Consent management
- Data export/deletion
- Breach notification (72 hours)

### CCPA
- Privacy policy
- Opt-out mechanisms
- Data request handling

### Standards
- OWASP Top 10
- CWE/SANS Top 25
- PCI DSS (if payment)

## Security Headers

```typescript
// Helmet.js
app.use(helmet());

// Sets automatically:
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Strict-Transport-Security: max-age=31536000
Content-Security-Policy: ...
```

## Regular Security Audits

- Code review: Every PR
- Dependency audit: Weekly
- Penetration testing: Quarterly
- Security training: Annually
- Backup testing: Monthly
