# Configuration Management System - Technical Design

## Overview

The Configuration Management System is a centralized backend service that manages all application configuration, secrets, feature flags, and dynamic content. It replaces 50+ hardcoded values scattered across 27+ files with a secure, maintainable, and environment-aware configuration system.

The system provides:
- Centralized configuration API with separate frontend/backend endpoints
- Environment-specific configuration (development, staging, production)
- Secure secrets management with encryption and rotation
- Feature flags system with gradual rollout capabilities
- Frontend configuration delivery with localStorage caching
- Configuration schema validation and documentation
- Efficient caching strategy (in-memory + optional Redis)
- Admin panel for configuration management
- Comprehensive audit logging for compliance
- Configuration versioning and rollback capabilities
- Multi-instance synchronization

## System Architecture

### High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        Frontend Application                      │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  React Components                                        │   │
│  │  ├─ ConfigContext (provides config to all components)   │   │
│  │  ├─ useConfig hook (access configuration)               │   │
│  │  └─ Feature flag checks (conditional rendering)         │   │
│  └──────────────────────────────────────────────────────────┘   │
│                              ▲                                    │
│                              │ HTTP                              │
└──────────────────────────────┼────────────────────────────────────┘
                               │
                    ┌──────────┴──────────┐
                    │                     │
                    ▼                     ▼
        ┌─────────────────────┐  ┌──────────────────┐
        │ /api/config/frontend│  │ /api/config/docs │
        │ /api/features       │  │ /api/config/schema
        │ /api/health         │  │ /api/metrics     │
        └─────────────────────┘  └──────────────────┘
                    │                     │
                    └──────────┬──────────┘
                               │
                    ┌──────────▼──────────┐
                    │  Backend API Layer  │
                    │  (Express.js)       │
                    └──────────┬──────────┘
                               │
        ┌──────────────────────┼──────────────────────┐
        │                      │                      │
        ▼                      ▼                      ▼
┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│ Configuration    │  │ Cache Layer      │  │ Secrets Manager  │
│ Service          │  │ (In-Memory +     │  │ (AWS Secrets Mgr)│
│                  │  │  Optional Redis) │  │                  │
└────────┬─────────┘  └──────────────────┘  └──────────────────┘
         │
         ▼
┌──────────────────────────────────────────────────────────────┐
│                    MongoDB Database                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐   │
│  │ Configurations│  │ Feature Flags│  │ Audit Logs       │   │
│  │ (versioned)  │  │ (with history)│  │ (compliance)     │   │
│  └──────────────┘  └──────────────┘  └──────────────────┘   │
└──────────────────────────────────────────────────────────────┘
```

### Configuration Service Architecture

```
┌─────────────────────────────────────────────────────────────┐
│              Configuration Service (Express.js)             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ API Routes Layer                                     │  │
│  │ ├─ GET /api/config/frontend                         │  │
│  │ ├─ GET /api/config/backend                          │  │
│  │ ├─ GET /api/features                                │  │
│  │ ├─ POST /api/admin/config (admin only)              │  │
│  │ ├─ GET /api/config/schema                           │  │
│  │ ├─ GET /api/config/docs                             │  │
│  │ ├─ GET /api/health                                  │  │
│  │ └─ GET /metrics                                     │  │
│  └──────────────────────────────────────────────────────┘  │
│                           ▲                                 │
│                           │                                 │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Service Layer                                        │  │
│  │ ├─ ConfigurationService                             │  │
│  │ │  ├─ loadConfiguration()                           │  │
│  │ │  ├─ getConfiguration(key)                         │  │
│  │ │  ├─ updateConfiguration(key, value)               │  │
│  │ │  └─ getConfigurationVersion(versionId)            │  │
│  │ ├─ FeatureFlagService                               │  │
│  │ │  ├─ evaluateFlag(flagName, userId, attributes)    │  │
│  │ │  ├─ updateFlag(flagName, value)                   │  │
│  │ │  └─ getFlagMetadata(flagName)                     │  │
│  │ ├─ CacheManager                                     │  │
│  │ │  ├─ get(key)                                      │  │
│  │ │  ├─ set(key, value, ttl)                          │  │
│  │ │  ├─ invalidate(key)                               │  │
│  │ │  └─ getStats()                                    │  │
│  │ ├─ SecretsManager                                   │  │
│  │ │  ├─ getSecret(secretName)                         │  │
│  │ │  ├─ rotateSecret(secretName)                      │  │
│  │ │  └─ maskSecret(secretValue)                       │  │
│  │ ├─ ConfigValidator                                  │  │
│  │ │  ├─ validate(config, schema)                      │  │
│  │ │  └─ getValidationErrors()                         │  │
│  │ └─ AuditLogger                                      │  │
│  │    ├─ logChange(change)                             │  │
│  │    ├─ getAuditLog(filters)                          │  │
│  │    └─ maskSecrets(logEntry)                         │  │
│  └──────────────────────────────────────────────────────┘  │
│                           ▲                                 │
│                           │                                 │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ Data Access Layer                                    │  │
│  │ ├─ ConfigurationRepository                          │  │
│  │ ├─ FeatureFlagRepository                            │  │
│  │ ├─ AuditLogRepository                               │  │
│  │ └─ CacheRepository                                  │  │
│  └──────────────────────────────────────────────────────┘  │
│                           ▲                                 │
│                           │                                 │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ External Integrations                                │  │
│  │ ├─ AWS Secrets Manager                              │  │
│  │ ├─ Redis (optional distributed cache)               │  │
│  │ ├─ MongoDB                                           │  │
│  │ └─ Message Queue (for multi-instance sync)           │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Cache Layer Design

```
┌─────────────────────────────────────────────────────────────┐
│                    Cache Layer Architecture                 │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ L1 Cache: In-Memory (Node.js Process)               │  │
│  │ ├─ TTL: 5 minutes (configurable)                    │  │
│  │ ├─ Storage: JavaScript Map/Object                   │  │
│  │ ├─ Scope: Single instance                           │  │
│  │ └─ Use: Fast access, no network latency             │  │
│  └──────────────────────────────────────────────────────┘  │
│                           ▲                                 │
│                           │ Cache Miss                      │
│                           │                                 │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ L2 Cache: Redis (Optional, Distributed)             │  │
│  │ ├─ TTL: 10 minutes (configurable)                   │  │
│  │ ├─ Storage: Redis key-value store                   │  │
│  │ ├─ Scope: All instances                             │  │
│  │ └─ Use: Shared cache across multiple instances      │  │
│  └──────────────────────────────────────────────────────┘  │
│                           ▲                                 │
│                           │ Cache Miss                      │
│                           │                                 │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ L3: Database (MongoDB)                              │  │
│  │ ├─ Persistent storage                               │  │
│  │ ├─ Source of truth                                  │  │
│  │ └─ Slower access (network + query)                  │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                             │
│  Cache Invalidation Strategy:                              │
│  ├─ TTL-based: Automatic expiration after TTL             │  │
│  ├─ Event-based: Invalidate on configuration change       │  │
│  ├─ Manual: Admin-triggered invalidation                  │  │
│  └─ Webhook: External system triggers invalidation        │  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Components and Interfaces

### API Endpoints

#### 1. Frontend Configuration Endpoint
```
GET /api/config/frontend
Authorization: Bearer {token}
Accept: application/json

Response (200 OK):
{
  "branding": {
    "primaryColor": "#008B8B",
    "secondaryColor": "#FF6B6B",
    "accentColor": "#FFD700",
    "brandName": "The Tribes of Travellers",
    "contactPhone": "1800-123-5555",
    "contactEmail": "customercare@thetribesoftravellers.com",
    "socialLinks": {
      "facebook": "https://facebook.com/...",
      "instagram": "https://instagram.com/...",
      "twitter": "https://twitter.com/..."
    }
  },
  "features": {
    "chatWidgetEnabled": true,
    "leadPopupEnabled": true,
    "analyticsEnabled": true,
    "paymentGatewayEnabled": true
  },
  "api": {
    "baseUrl": "https://api.example.com",
    "timeout": 30000,
    "retryAttempts": 3
  },
  "theme": {
    "mode": "light",
    "colors": {
      "background": "#FFFFFF",
      "text": "#000000"
    }
  },
  "version": "1.0.0",
  "lastUpdated": "2024-01-15T10:30:00Z"
}

Cache-Control: public, max-age=300
ETag: "abc123def456"
```

#### 2. Backend Configuration Endpoint
```
GET /api/config/backend
Authorization: Bearer {adminToken}
Accept: application/json

Response (200 OK):
{
  "database": {
    "uri": "mongodb+srv://...",
    "poolSize": 5,
    "connectionTimeout": 15000,
    "socketTimeout": 45000
  },
  "jwt": {
    "secret": "***MASKED***",
    "expiration": "7d",
    "refreshExpiration": "30d",
    "algorithm": "HS256"
  },
  "api": {
    "requestTimeout": 30000,
    "requestSizeLimit": "10mb",
    "cors": {
      "allowedOrigins": ["https://example.com"],
      "allowedMethods": ["GET", "POST", "PUT", "DELETE"],
      "allowedHeaders": ["Content-Type", "Authorization"]
    },
    "rateLimit": {
      "windowMs": 60000,
      "maxRequests": 100
    }
  },
  "secrets": {
    "awsAccessKeyId": "***MASKED***",
    "awsSecretAccessKey": "***MASKED***",
    "stripeApiKey": "***MASKED***"
  },
  "features": {
    "adminFeaturesEnabled": true,
    "agentFeaturesEnabled": true
  }
}

Cache-Control: private, max-age=300
```

#### 3. Feature Flags Endpoint
```
GET /api/features
Authorization: Bearer {token}
Accept: application/json

Response (200 OK):
{
  "flags": {
    "chatWidgetEnabled": {
      "value": true,
      "type": "boolean",
      "description": "Enable/disable chat widget",
      "owner": "product-team",
      "createdAt": "2024-01-01T00:00:00Z",
      "lastModifiedAt": "2024-01-15T10:30:00Z"
    },
    "leadPopupEnabled": {
      "value": true,
      "type": "boolean",
      "description": "Enable/disable lead popup",
      "owner": "product-team",
      "createdAt": "2024-01-01T00:00:00Z",
      "lastModifiedAt": "2024-01-15T10:30:00Z"
    },
    "newFeatureRollout": {
      "value": 25,
      "type": "percentage",
      "description": "Gradual rollout of new feature",
      "owner": "engineering-team",
      "createdAt": "2024-01-10T00:00:00Z",
      "lastModifiedAt": "2024-01-15T10:30:00Z"
    }
  },
  "version": "1.0.0",
  "lastUpdated": "2024-01-15T10:30:00Z"
}

Cache-Control: public, max-age=60
```

#### 4. Configuration Schema Endpoint
```
GET /api/config/schema
Authorization: Bearer {token}
Accept: application/json

Response (200 OK):
{
  "version": "1.0.0",
  "schema": {
    "type": "object",
    "properties": {
      "branding": {
        "type": "object",
        "properties": {
          "primaryColor": {
            "type": "string",
            "pattern": "^#[0-9A-Fa-f]{6}$",
            "description": "Primary brand color in hex format"
          },
          "contactPhone": {
            "type": "string",
            "pattern": "^\\+?[0-9\\-\\s()]+$",
            "description": "Contact phone number"
          }
        },
        "required": ["primaryColor", "contactPhone"]
      },
      "api": {
        "type": "object",
        "properties": {
          "requestTimeout": {
            "type": "integer",
            "minimum": 1000,
            "maximum": 300000,
            "description": "Request timeout in milliseconds"
          }
        }
      }
    },
    "required": ["branding", "api"]
  }
}
```

#### 5. Configuration Documentation Endpoint
```
GET /api/config/docs
Authorization: Bearer {token}
Accept: application/json

Response (200 OK):
{
  "version": "1.0.0",
  "documentation": "# Configuration Documentation\n\n## Branding Configuration\n\n...",
  "examples": {
    "branding": {
      "primaryColor": "#008B8B",
      "contactPhone": "1800-123-5555"
    }
  }
}
```

#### 6. Admin Configuration Management Endpoint
```
POST /api/admin/config
Authorization: Bearer {adminToken}
Content-Type: application/json

Request:
{
  "key": "branding.primaryColor",
  "value": "#FF6B6B",
  "reason": "Updated brand color for Q1 campaign"
}

Response (200 OK):
{
  "success": true,
  "message": "Configuration updated successfully",
  "version": "v2.1.0",
  "timestamp": "2024-01-15T10:30:00Z",
  "auditLogId": "audit_123456"
}

Response (400 Bad Request):
{
  "success": false,
  "error": "Validation failed",
  "details": [
    {
      "field": "value",
      "message": "Invalid hex color format"
    }
  ]
}
```

#### 7. Health Check Endpoint
```
GET /api/health
Accept: application/json

Response (200 OK):
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00Z",
  "services": {
    "database": {
      "status": "connected",
      "responseTime": 5
    },
    "cache": {
      "status": "connected",
      "hitRate": 0.85,
      "size": 1024000
    },
    "secretsManager": {
      "status": "connected",
      "responseTime": 10
    }
  },
  "configurationLoadTime": 45,
  "lastConfigurationUpdate": "2024-01-15T10:25:00Z"
}

Response (503 Service Unavailable):
{
  "status": "unhealthy",
  "timestamp": "2024-01-15T10:30:00Z",
  "services": {
    "database": {
      "status": "disconnected",
      "error": "Connection timeout"
    }
  }
}
```

#### 8. Metrics Endpoint
```
GET /metrics
Accept: text/plain

Response (200 OK):
# HELP config_requests_total Total number of configuration requests
# TYPE config_requests_total counter
config_requests_total{endpoint="/api/config/frontend"} 15234
config_requests_total{endpoint="/api/config/backend"} 8923

# HELP config_cache_hits_total Total number of cache hits
# TYPE config_cache_hits_total counter
config_cache_hits_total 12450

# HELP config_cache_misses_total Total number of cache misses
# TYPE config_cache_misses_total counter
config_cache_misses_total 2784

# HELP config_load_time_ms Configuration load time in milliseconds
# TYPE config_load_time_ms histogram
config_load_time_ms_bucket{le="10"} 100
config_load_time_ms_bucket{le="50"} 500
config_load_time_ms_bucket{le="100"} 1000
config_load_time_ms_bucket{le="+Inf"} 1234

# HELP config_validation_errors_total Total number of validation errors
# TYPE config_validation_errors_total counter
config_validation_errors_total 23
```

## Data Models

### Configuration Model
```javascript
// MongoDB Collection: configurations
{
  _id: ObjectId,
  key: String,                    // e.g., "branding.primaryColor"
  value: Mixed,                   // Any JSON-serializable value
  type: String,                   // "string", "number", "boolean", "object", "array"
  description: String,            // Human-readable description
  isSecret: Boolean,              // Whether value should be masked in logs
  environment: String,            // "development", "staging", "production", "all"
  version: Number,                // Version number for this key
  createdAt: Date,
  createdBy: String,              // User ID who created
  updatedAt: Date,
  updatedBy: String,              // User ID who last updated
  validationRules: {
    required: Boolean,
    pattern: String,              // Regex pattern for validation
    minLength: Number,
    maxLength: Number,
    minimum: Number,
    maximum: Number,
    enum: [String]                // Allowed values
  },
  metadata: {
    category: String,             // "branding", "api", "database", "jwt", etc.
    tags: [String],
    deprecated: Boolean,
    deprecationMessage: String
  }
}
```

### Feature Flag Model
```javascript
// MongoDB Collection: featureFlags
{
  _id: ObjectId,
  name: String,                   // e.g., "chatWidgetEnabled"
  description: String,
  type: String,                   // "boolean", "string", "percentage"
  value: Mixed,                   // Current value
  enabled: Boolean,               // Whether flag is active
  rolloutPercentage: Number,      // 0-100 for gradual rollout
  targetingRules: [
    {
      type: String,               // "role", "userId", "attribute"
      operator: String,           // "equals", "contains", "in"
      value: Mixed,
      result: Mixed               // Value if rule matches
    }
  ],
  owner: String,                  // Team/person responsible
  createdAt: Date,
  createdBy: String,
  updatedAt: Date,
  updatedBy: String,
  metadata: {
    tags: [String],
    deprecated: Boolean,
    releaseNotes: String
  }
}
```

### Audit Log Model
```javascript
// MongoDB Collection: auditLogs
{
  _id: ObjectId,
  timestamp: Date,
  userId: String,                 // User who made the change
  action: String,                 // "create", "update", "delete", "rollback"
  resourceType: String,           // "configuration", "featureFlag", "secret"
  resourceId: String,             // ID of changed resource
  resourceKey: String,            // e.g., "branding.primaryColor"
  oldValue: Mixed,                // Previous value (masked if secret)
  newValue: Mixed,                // New value (masked if secret)
  reason: String,                 // Why the change was made
  ipAddress: String,
  userAgent: String,
  status: String,                 // "success", "failed"
  errorMessage: String,           // If status is "failed"
  metadata: {
    environment: String,
    version: String,
    rollbackFrom: String           // If this is a rollback
  }
}
```

### Configuration Version Model
```javascript
// MongoDB Collection: configurationVersions
{
  _id: ObjectId,
  versionId: String,              // e.g., "v1.2.3"
  timestamp: Date,
  createdBy: String,
  description: String,
  configurations: {
    // Snapshot of all configurations at this version
    "branding.primaryColor": "#008B8B",
    "branding.contactPhone": "1800-123-5555",
    // ... all other configurations
  },
  featureFlags: {
    // Snapshot of all feature flags at this version
    "chatWidgetEnabled": true,
    "leadPopupEnabled": true,
    // ... all other flags
  },
  changes: [
    {
      key: String,
      oldValue: Mixed,
      newValue: Mixed,
      reason: String
    }
  ]
}
```

## Error Handling

### Configuration Validation Errors
```javascript
// Example: Invalid configuration value
{
  status: 400,
  error: "VALIDATION_ERROR",
  message: "Configuration validation failed",
  details: [
    {
      field: "branding.primaryColor",
      value: "#GGGGGG",
      error: "Invalid hex color format",
      expected: "Hex color format (#RRGGBB)"
    },
    {
      field: "api.requestTimeout",
      value: 500000,
      error: "Value exceeds maximum",
      expected: "Maximum 300000 milliseconds"
    }
  ]
}
```

### Missing Required Configuration
```javascript
{
  status: 500,
  error: "MISSING_CONFIGURATION",
  message: "Required configuration values are missing",
  missingKeys: [
    "database.uri",
    "jwt.secret",
    "branding.contactPhone"
  ]
}
```

### Cache Failures
```javascript
// Graceful degradation: Fall back to database
try {
  const cached = await cacheManager.get(key);
  if (cached) return cached;
} catch (cacheError) {
  logger.warn("Cache retrieval failed, falling back to database", { cacheError });
}

const value = await configurationRepository.get(key);
return value;
```

### Secrets Manager Failures
```javascript
{
  status: 503,
  error: "SECRETS_MANAGER_UNAVAILABLE",
  message: "Unable to retrieve secrets at this time",
  retryAfter: 30
}
```

## Testing Strategy

### Unit Tests
- Configuration validation against schema
- Feature flag evaluation logic
- Cache hit/miss scenarios
- Secret masking in logs
- Audit log creation

### Integration Tests
- End-to-end configuration retrieval
- Configuration update and cache invalidation
- Multi-instance synchronization
- Database connection and queries
- Secrets manager integration

### Property-Based Tests
- Configuration consistency across requests
- Cache invalidation propagation
- Feature flag consistency for same user
- Configuration schema validation

### Performance Tests
- Configuration load time (target: <100ms)
- Cache hit rate (target: >85%)
- API response time (target: <200ms)
- Memory usage under load



## Frontend Architecture

### ConfigContext React Component

```typescript
// src/context/ConfigContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';

interface ConfigContextType {
  config: Configuration | null;
  features: FeatureFlags | null;
  loading: boolean;
  error: Error | null;
  refreshConfig: () => Promise<void>;
  isFeatureEnabled: (flagName: string) => boolean;
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

export const ConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<Configuration | null>(null);
  const [features, setFeatures] = useState<FeatureFlags | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Load configuration on mount
  useEffect(() => {
    loadConfiguration();
    
    // Set up periodic refresh (every 5 minutes)
    const interval = setInterval(loadConfiguration, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const loadConfiguration = async () => {
    try {
      setLoading(true);
      
      // Check localStorage cache first
      const cached = getFromCache();
      if (cached && !isCacheExpired()) {
        setConfig(cached.config);
        setFeatures(cached.features);
        setLoading(false);
        return;
      }

      // Fetch from API
      const [configResponse, featuresResponse] = await Promise.all([
        fetch('/api/config/frontend', {
          headers: { 'Authorization': `Bearer ${getToken()}` }
        }),
        fetch('/api/features', {
          headers: { 'Authorization': `Bearer ${getToken()}` }
        })
      ]);

      if (!configResponse.ok || !featuresResponse.ok) {
        throw new Error('Failed to load configuration');
      }

      const newConfig = await configResponse.json();
      const newFeatures = await featuresResponse.json();

      setConfig(newConfig);
      setFeatures(newFeatures);
      
      // Cache in localStorage
      saveToCache(newConfig, newFeatures);
      setError(null);
    } catch (err) {
      setError(err as Error);
      // Fall back to cached config if available
      const cached = getFromCache();
      if (cached) {
        setConfig(cached.config);
        setFeatures(cached.features);
      }
    } finally {
      setLoading(false);
    }
  };

  const isFeatureEnabled = (flagName: string): boolean => {
    if (!features?.flags[flagName]) return false;
    
    const flag = features.flags[flagName];
    
    if (flag.type === 'boolean') {
      return flag.value === true;
    }
    
    if (flag.type === 'percentage') {
      // Consistent hash-based rollout
      const userId = getCurrentUserId();
      const hash = hashUserId(userId, flagName);
      return hash < flag.value;
    }
    
    return false;
  };

  return (
    <ConfigContext.Provider value={{
      config,
      features,
      loading,
      error,
      refreshConfig: loadConfiguration,
      isFeatureEnabled
    }}>
      {children}
    </ConfigContext.Provider>
  );
};

export const useConfig = () => {
  const context = useContext(ConfigContext);
  if (!context) {
    throw new Error('useConfig must be used within ConfigProvider');
  }
  return context;
};

// Cache helpers
const CACHE_KEY = 'app_config_cache';
const CACHE_TTL = 60 * 60 * 1000; // 1 hour

function getFromCache() {
  const cached = localStorage.getItem(CACHE_KEY);
  if (!cached) return null;
  
  try {
    return JSON.parse(cached);
  } catch {
    return null;
  }
}

function saveToCache(config: Configuration, features: FeatureFlags) {
  const cacheData = {
    config,
    features,
    timestamp: Date.now()
  };
  localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
}

function isCacheExpired(): boolean {
  const cached = localStorage.getItem(CACHE_KEY);
  if (!cached) return true;
  
  try {
    const { timestamp } = JSON.parse(cached);
    return Date.now() - timestamp > CACHE_TTL;
  } catch {
    return true;
  }
}
```

### useConfig Hook

```typescript
// src/hooks/useConfig.ts
import { useConfig as useConfigContext } from '../context/ConfigContext';

export const useConfig = () => {
  const { config, features, loading, error, isFeatureEnabled } = useConfigContext();

  return {
    // Branding
    brandName: config?.branding?.brandName,
    primaryColor: config?.branding?.primaryColor,
    contactPhone: config?.branding?.contactPhone,
    contactEmail: config?.branding?.contactEmail,
    
    // Features
    isChatWidgetEnabled: isFeatureEnabled('chatWidgetEnabled'),
    isLeadPopupEnabled: isFeatureEnabled('leadPopupEnabled'),
    isAnalyticsEnabled: isFeatureEnabled('analyticsEnabled'),
    
    // API
    apiBaseUrl: config?.api?.baseUrl,
    apiTimeout: config?.api?.timeout,
    
    // State
    loading,
    error,
    isFeatureEnabled
  };
};
```

### Usage in Components

```typescript
// Example: Using configuration in a component
import { useConfig } from '../hooks/useConfig';

export const Header: React.FC = () => {
  const { brandName, primaryColor, isChatWidgetEnabled } = useConfig();

  return (
    <header style={{ backgroundColor: primaryColor }}>
      <h1>{brandName}</h1>
      {isChatWidgetEnabled && <ChatWidget />}
    </header>
  );
};
```

## Backend Architecture

### Configuration Service Implementation

```javascript
// backend/services/ConfigurationService.js
const ConfigurationRepository = require('../repositories/ConfigurationRepository');
const CacheManager = require('./CacheManager');
const ConfigValidator = require('./ConfigValidator');
const AuditLogger = require('./AuditLogger');

class ConfigurationService {
  constructor() {
    this.repository = new ConfigurationRepository();
    this.cache = new CacheManager();
    this.validator = new ConfigValidator();
    this.auditLogger = new AuditLogger();
  }

  async loadConfiguration(environment = process.env.NODE_ENV || 'development') {
    const cacheKey = `config:${environment}`;
    
    // Try cache first
    const cached = await this.cache.get(cacheKey);
    if (cached) {
      return cached;
    }

    // Load from database
    const configs = await this.repository.findByEnvironment(environment);
    
    // Validate configuration
    const validation = this.validator.validate(configs);
    if (!validation.valid) {
      throw new Error(`Configuration validation failed: ${validation.errors.join(', ')}`);
    }

    // Cache for 5 minutes
    await this.cache.set(cacheKey, configs, 5 * 60);
    
    return configs;
  }

  async getConfiguration(key, environment = 'all') {
    const cacheKey = `config:${key}:${environment}`;
    
    // Try cache
    const cached = await this.cache.get(cacheKey);
    if (cached) {
      return cached;
    }

    // Load from database
    const config = await this.repository.findByKey(key, environment);
    
    if (!config) {
      throw new Error(`Configuration key not found: ${key}`);
    }

    // Cache for 5 minutes
    await this.cache.set(cacheKey, config, 5 * 60);
    
    return config;
  }

  async updateConfiguration(key, value, userId, reason) {
    // Validate new value
    const config = await this.repository.findByKey(key);
    if (!config) {
      throw new Error(`Configuration key not found: ${key}`);
    }

    const validation = this.validator.validateValue(value, config.validationRules);
    if (!validation.valid) {
      throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
    }

    // Store old value for audit
    const oldValue = config.value;

    // Update in database
    const updated = await this.repository.update(key, {
      value,
      updatedAt: new Date(),
      updatedBy: userId,
      version: config.version + 1
    });

    // Create audit log
    await this.auditLogger.log({
      userId,
      action: 'update',
      resourceType: 'configuration',
      resourceKey: key,
      oldValue: config.isSecret ? '***MASKED***' : oldValue,
      newValue: config.isSecret ? '***MASKED***' : value,
      reason,
      status: 'success'
    });

    // Invalidate cache
    await this.cache.invalidate(`config:${key}:*`);
    await this.cache.invalidate(`config:*`);

    // Publish update event for multi-instance sync
    await this.publishConfigurationUpdate(key, value);

    return updated;
  }

  async getConfigurationVersion(versionId) {
    return await this.repository.findVersion(versionId);
  }

  async rollbackConfiguration(versionId, userId, reason) {
    const version = await this.getConfigurationVersion(versionId);
    if (!version) {
      throw new Error(`Version not found: ${versionId}`);
    }

    // Restore all configurations from version
    for (const [key, value] of Object.entries(version.configurations)) {
      await this.updateConfiguration(key, value, userId, `Rollback to ${versionId}: ${reason}`);
    }

    // Create audit log for rollback
    await this.auditLogger.log({
      userId,
      action: 'rollback',
      resourceType: 'configuration',
      resourceId: versionId,
      reason,
      status: 'success',
      metadata: { rollbackFrom: versionId }
    });

    return version;
  }

  async publishConfigurationUpdate(key, value) {
    // Publish to message queue for multi-instance sync
    // Implementation depends on message queue (RabbitMQ, SQS, etc.)
    // This allows other instances to invalidate their cache
  }
}

module.exports = ConfigurationService;
```

### Feature Flag Service

```javascript
// backend/services/FeatureFlagService.js
const FeatureFlagRepository = require('../repositories/FeatureFlagRepository');
const CacheManager = require('./CacheManager');

class FeatureFlagService {
  constructor() {
    this.repository = new FeatureFlagRepository();
    this.cache = new CacheManager();
  }

  async evaluateFlag(flagName, userId, attributes = {}) {
    const cacheKey = `flag:${flagName}`;
    
    // Get flag definition
    let flag = await this.cache.get(cacheKey);
    if (!flag) {
      flag = await this.repository.findByName(flagName);
      if (!flag) {
        return false; // Default to false if flag doesn't exist
      }
      await this.cache.set(cacheKey, flag, 10 * 60); // Cache for 10 minutes
    }

    if (!flag.enabled) {
      return false;
    }

    // Evaluate based on type
    if (flag.type === 'boolean') {
      return flag.value === true;
    }

    if (flag.type === 'percentage') {
      return this.evaluatePercentageFlag(flag, userId);
    }

    if (flag.type === 'string') {
      return flag.value;
    }

    // Evaluate targeting rules
    for (const rule of flag.targetingRules || []) {
      if (this.evaluateRule(rule, userId, attributes)) {
        return rule.result;
      }
    }

    return flag.value;
  }

  evaluatePercentageFlag(flag, userId) {
    // Consistent hash-based rollout
    const hash = this.hashUserId(userId, flag.name);
    return hash < flag.rolloutPercentage;
  }

  evaluateRule(rule, userId, attributes) {
    const value = rule.type === 'userId' ? userId : attributes[rule.type];
    
    switch (rule.operator) {
      case 'equals':
        return value === rule.value;
      case 'contains':
        return String(value).includes(String(rule.value));
      case 'in':
        return Array.isArray(rule.value) && rule.value.includes(value);
      default:
        return false;
    }
  }

  hashUserId(userId, flagName) {
    // Consistent hash function for percentage-based rollout
    const crypto = require('crypto');
    const hash = crypto.createHash('md5').update(`${userId}:${flagName}`).digest('hex');
    return parseInt(hash.substring(0, 8), 16) % 100;
  }

  async updateFlag(flagName, updates, userId, reason) {
    const flag = await this.repository.findByName(flagName);
    if (!flag) {
      throw new Error(`Flag not found: ${flagName}`);
    }

    // Update flag
    const updated = await this.repository.update(flagName, {
      ...updates,
      updatedAt: new Date(),
      updatedBy: userId
    });

    // Invalidate cache
    await this.cache.invalidate(`flag:${flagName}`);

    // Publish update event
    await this.publishFlagUpdate(flagName, updates);

    return updated;
  }

  async publishFlagUpdate(flagName, updates) {
    // Publish to message queue for multi-instance sync
  }
}

module.exports = FeatureFlagService;
```

### Cache Manager

```javascript
// backend/services/CacheManager.js
const redis = require('redis');

class CacheManager {
  constructor() {
    this.memoryCache = new Map();
    this.redisClient = process.env.REDIS_URL ? redis.createClient({ url: process.env.REDIS_URL }) : null;
    this.stats = {
      hits: 0,
      misses: 0,
      size: 0
    };
  }

  async get(key) {
    // Try memory cache first
    const memCached = this.memoryCache.get(key);
    if (memCached && !this.isExpired(memCached)) {
      this.stats.hits++;
      return memCached.value;
    }

    // Try Redis if available
    if (this.redisClient) {
      try {
        const redisCached = await this.redisClient.get(key);
        if (redisCached) {
          this.stats.hits++;
          const value = JSON.parse(redisCached);
          // Update memory cache
          this.memoryCache.set(key, { value, expiry: Date.now() + 5 * 60 * 1000 });
          return value;
        }
      } catch (err) {
        console.warn('Redis get failed, continuing without cache', err);
      }
    }

    this.stats.misses++;
    return null;
  }

  async set(key, value, ttlSeconds = 300) {
    const expiry = Date.now() + ttlSeconds * 1000;

    // Store in memory cache
    this.memoryCache.set(key, { value, expiry });
    this.stats.size = this.memoryCache.size;

    // Store in Redis if available
    if (this.redisClient) {
      try {
        await this.redisClient.setEx(key, ttlSeconds, JSON.stringify(value));
      } catch (err) {
        console.warn('Redis set failed, continuing with memory cache only', err);
      }
    }
  }

  async invalidate(pattern) {
    // Invalidate memory cache
    for (const key of this.memoryCache.keys()) {
      if (this.matchesPattern(key, pattern)) {
        this.memoryCache.delete(key);
      }
    }

    // Invalidate Redis if available
    if (this.redisClient) {
      try {
        const keys = await this.redisClient.keys(pattern);
        if (keys.length > 0) {
          await this.redisClient.del(keys);
        }
      } catch (err) {
        console.warn('Redis invalidate failed', err);
      }
    }

    this.stats.size = this.memoryCache.size;
  }

  matchesPattern(key, pattern) {
    // Simple pattern matching (supports * wildcard)
    const regex = new RegExp(`^${pattern.replace(/\*/g, '.*')}$`);
    return regex.test(key);
  }

  isExpired(cached) {
    return cached.expiry && Date.now() > cached.expiry;
  }

  getStats() {
    const hitRate = this.stats.hits + this.stats.misses > 0
      ? (this.stats.hits / (this.stats.hits + this.stats.misses)) * 100
      : 0;

    return {
      hits: this.stats.hits,
      misses: this.stats.misses,
      hitRate: hitRate.toFixed(2) + '%',
      size: this.stats.size
    };
  }
}

module.exports = CacheManager;
```

## Security Design

### Secret Masking in Logs

```javascript
// backend/utils/SecretMasker.js
class SecretMasker {
  static maskSecrets(obj, secretKeys = []) {
    if (!obj) return obj;

    const masked = JSON.parse(JSON.stringify(obj));
    const secretPatterns = [
      'secret', 'password', 'token', 'key', 'credential',
      'apiKey', 'accessKey', 'privateKey', ...secretKeys
    ];

    const maskValue = (obj, patterns) => {
      for (const key in obj) {
        if (patterns.some(pattern => key.toLowerCase().includes(pattern.toLowerCase()))) {
          obj[key] = '***MASKED***';
        } else if (typeof obj[key] === 'object' && obj[key] !== null) {
          maskValue(obj[key], patterns);
        }
      }
    };

    maskValue(masked, secretPatterns);
    return masked;
  }

  static maskString(str, visibleChars = 4) {
    if (!str || str.length <= visibleChars) {
      return '***MASKED***';
    }
    return str.substring(0, visibleChars) + '*'.repeat(str.length - visibleChars);
  }
}

module.exports = SecretMasker;
```

### Secrets Manager Integration

```javascript
// backend/services/SecretsManager.js
const AWS = require('aws-sdk');

class SecretsManager {
  constructor() {
    this.client = new AWS.SecretsManager({ region: process.env.AWS_REGION });
    this.cache = new Map();
  }

  async getSecret(secretName) {
    // Check cache first
    const cached = this.cache.get(secretName);
    if (cached && !this.isExpired(cached)) {
      return cached.value;
    }

    try {
      const response = await this.client.getSecretValue({ SecretId: secretName }).promise();
      const secret = response.SecretString ? JSON.parse(response.SecretString) : response.SecretBinary;

      // Cache for 1 hour
      this.cache.set(secretName, {
        value: secret,
        expiry: Date.now() + 60 * 60 * 1000
      });

      return secret;
    } catch (err) {
      console.error(`Failed to retrieve secret: ${secretName}`, err);
      throw new Error('Unable to retrieve secret');
    }
  }

  async rotateSecret(secretName) {
    // Invalidate cache
    this.cache.delete(secretName);

    // Fetch new secret
    return await this.getSecret(secretName);
  }

  isExpired(cached) {
    return cached.expiry && Date.now() > cached.expiry;
  }
}

module.exports = SecretsManager;
```

## Migration Strategy

### Identifying Hardcoded Values

```javascript
// scripts/findHardcodedValues.js
const fs = require('fs');
const path = require('path');

const HARDCODED_VALUES = {
  'contact_phone': ['1800-123-5555'],
  'contact_email': ['customercare@thetribesoftravellers.com'],
  'primary_color': ['#008B8B', '0, 139, 139'],
  'secondary_color': ['#FF6B6B'],
  'accent_color': ['#FFD700'],
  'jwt_expiration': ['7d', '7 days'],
  'request_timeout': ['30000', '30 seconds'],
  'request_size_limit': ['10mb', '10485760'],
  'db_pool_size': ['5'],
  'db_connection_timeout': ['15000', '15 seconds']
};

function findHardcodedValues(dir, results = []) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
      findHardcodedValues(filePath, results);
    } else if (stat.isFile() && (file.endsWith('.js') || file.endsWith('.ts') || file.endsWith('.tsx'))) {
      const content = fs.readFileSync(filePath, 'utf8');

      for (const [key, values] of Object.entries(HARDCODED_VALUES)) {
        for (const value of values) {
          if (content.includes(value)) {
            results.push({
              file: filePath,
              key,
              value,
              line: content.split('\n').findIndex(line => line.includes(value)) + 1
            });
          }
        }
      }
    }
  }

  return results;
}

const results = findHardcodedValues('./src');
console.log(JSON.stringify(results, null, 2));
```

### Migration Execution

```javascript
// scripts/migrateToConfiguration.js
const ConfigurationService = require('../backend/services/ConfigurationService');

const MIGRATIONS = [
  {
    key: 'branding.contactPhone',
    value: '1800-123-5555',
    description: 'Contact phone number',
    files: ['src/components/Footer.tsx', 'src/pages/ContactPage.tsx']
  },
  {
    key: 'branding.contactEmail',
    value: 'customercare@thetribesoftravellers.com',
    description: 'Contact email address',
    files: ['src/components/Footer.tsx', 'src/pages/ContactPage.tsx']
  },
  {
    key: 'branding.primaryColor',
    value: '#008B8B',
    description: 'Primary brand color',
    files: ['src/App.css', 'src/components/Header.tsx']
  }
  // ... more migrations
];

async function executeMigration(dryRun = true) {
  const configService = new ConfigurationService();

  for (const migration of MIGRATIONS) {
    console.log(`Migrating: ${migration.key}`);
    console.log(`  Value: ${migration.value}`);
    console.log(`  Files: ${migration.files.join(', ')}`);

    if (!dryRun) {
      // Create configuration entry
      await configService.updateConfiguration(
        migration.key,
        migration.value,
        'migration-script',
        `Migrated from hardcoded value in files: ${migration.files.join(', ')}`
      );

      // Update files to use configuration
      for (const file of migration.files) {
        updateFileToUseConfiguration(file, migration);
      }
    }
  }
}

function updateFileToUseConfiguration(filePath, migration) {
  // Implementation to replace hardcoded values with configuration references
  // This would use AST parsing or regex replacement depending on file type
}

// Run migration
executeMigration(true); // Dry run first
// executeMigration(false); // Execute migration
```

## Performance Targets

- Configuration load time: < 100ms
- Cache hit rate: > 85%
- API response time: < 200ms
- Memory usage: < 100MB per instance
- Database query time: < 50ms

## Monitoring and Observability

### Prometheus Metrics

```javascript
// backend/middleware/metricsMiddleware.js
const prometheus = require('prom-client');

const configRequestsTotal = new prometheus.Counter({
  name: 'config_requests_total',
  help: 'Total number of configuration requests',
  labelNames: ['endpoint', 'status']
});

const configCacheHitsTotal = new prometheus.Counter({
  name: 'config_cache_hits_total',
  help: 'Total number of cache hits'
});

const configLoadTimeMs = new prometheus.Histogram({
  name: 'config_load_time_ms',
  help: 'Configuration load time in milliseconds',
  buckets: [10, 50, 100, 500, 1000]
});

module.exports = {
  configRequestsTotal,
  configCacheHitsTotal,
  configLoadTimeMs
};
```

## Conclusion

This comprehensive technical design provides a complete blueprint for implementing the Configuration Management System. The system is designed to be:

- **Secure**: Secrets are masked in logs, encrypted in transit, and managed securely
- **Performant**: Multi-level caching ensures fast configuration retrieval
- **Scalable**: Supports multi-instance deployments with synchronization
- **Maintainable**: Clear separation of concerns with well-defined services
- **Compliant**: Comprehensive audit logging for compliance requirements
- **Flexible**: Supports various configuration types and feature flag strategies

The implementation should follow the architecture patterns described, use the provided code examples as templates, and adapt them to the specific project requirements.


## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Frontend Configuration Never Exposes Secrets

*For any* configuration request to the frontend endpoint, the response SHALL NOT contain any secret values (API keys, database credentials, private keys, JWT secrets).

**Validates: Requirements 1.3, 2.7**

### Property 2: Configuration Consistency Within TTL Window

*For any* configuration key requested multiple times within the TTL window (5 minutes for backend, 1 hour for frontend), the Configuration_Service SHALL return identical values across all requests.

**Validates: Requirements 1.1, 1.2, 5.3, 7.2**

### Property 3: Environment-Specific Configuration Precedence

*For any* configuration merge operation with default and environment-specific values, environment-specific values SHALL take precedence over default values, and all values from both sources SHALL be preserved without loss.

**Validates: Requirements 2.4, 2.6**

### Property 4: Secrets Are Masked in All Logs

*For any* configuration change involving a secret value, the audit log entry SHALL NOT contain the actual secret value, only a masked representation (***MASKED***).

**Validates: Requirements 3.2, 3.3, 15.3**

### Property 5: Cache Invalidation on Secret Rotation

*For any* secret rotation operation, the cache SHALL be invalidated, and the next request for that secret SHALL retrieve the new value from the secrets manager.

**Validates: Requirements 3.5, 7.4**

### Property 6: Consistent Feature Flag Evaluation for Percentage-Based Flags

*For any* percentage-based feature flag and any user ID, the Feature_Flag_Service SHALL return consistent results across multiple evaluations (same user always gets same result).

**Validates: Requirements 4.4**

### Property 7: Feature Flag Metadata Completeness

*For any* feature flag request, the response SHALL include complete metadata (description, owner, created_date, last_modified_date) for all flags.

**Validates: Requirements 4.2**

### Property 8: Configuration Schema Validation Completeness

*For any* invalid configuration object, the Config_Validator SHALL return detailed validation errors identifying all invalid fields and the specific validation rules that failed.

**Validates: Requirements 6.3**

### Property 9: Color Value Validation

*For any* branding color configuration value, the Configuration_Service SHALL validate that the value is in valid hex (#RRGGBB) or RGB format, rejecting invalid formats.

**Validates: Requirements 8.5**

### Property 10: Destination Filtering Correctness

*For any* destination filter request (by type, price range, rating), the Configuration_Service SHALL return only destinations matching the specified filter criteria.

**Validates: Requirements 9.5**

### Property 11: Destination Sorting Correctness

*For any* destination sorting request (by price, rating, popularity), the Configuration_Service SHALL return destinations in the correct sort order.

**Validates: Requirements 9.6**

### Property 12: Destination Search Functionality

*For any* search query for destinations or packages, the Configuration_Service SHALL return results containing the search term in name, description, or metadata.

**Validates: Requirements 9.7**

### Property 13: API Configuration Timeout Validation

*For any* timeout configuration value, the Configuration_Service SHALL validate that the value is between 1 second (1000ms) and 5 minutes (300000ms).

**Validates: Requirements 10.3**

### Property 14: API Configuration Request Size Validation

*For any* request size limit configuration value, the Configuration_Service SHALL validate that the value is between 1MB and 100MB.

**Validates: Requirements 10.4**

### Property 15: CORS Origin URL Validation

*For any* CORS origin configuration value, the Configuration_Service SHALL validate that the value is a valid URL format.

**Validates: Requirements 10.5**

### Property 16: Database Connection String Validation

*For any* database connection string, the Configuration_Service SHALL validate the format is correct for the specified database type (MongoDB, PostgreSQL, etc.).

**Validates: Requirements 11.2**

### Property 17: JWT Expiration Range Validation

*For any* JWT expiration configuration value, the Configuration_Service SHALL validate that the value is between 1 hour and 365 days.

**Validates: Requirements 12.5**

### Property 18: Configuration Version Diff Accuracy

*For any* two configuration versions, the Admin_Panel SHALL correctly identify and display all differences between the versions.

**Validates: Requirements 18.4**

### Property 19: Configuration Schema Completeness

*For any* configuration schema request, the response SHALL include all available configuration keys with descriptions, types, defaults, and constraints.

**Validates: Requirements 19.1**

### Property 20: Configuration Documentation Completeness

*For any* configuration documentation request, the response SHALL include markdown documentation for all configuration options with examples.

**Validates: Requirements 19.2**

### Property 21: Configuration Search Accuracy

*For any* configuration search query, the Configuration_Service SHALL return all configuration keys matching the search term in key name or description.

**Validates: Requirements 19.4**

### Property Reflection

After reviewing all identified properties, the following consolidations were made:

- Properties 10, 11, 12 (destination filtering, sorting, search) are related but distinct operations that each provide unique validation value
- Properties 13, 14, 15, 16, 17 (various validation rules) are distinct validation scenarios that should each be tested
- Properties 19, 20, 21 (schema, documentation, search) are related but test different aspects of configuration discovery

All remaining properties provide unique validation value and should be implemented as separate property-based tests.
