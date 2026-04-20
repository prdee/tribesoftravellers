/**
 * MongoDB Collections Setup Script
 * 
 * This script initializes all required MongoDB collections for the Configuration Management System:
 * - configurations: Stores configuration key-value pairs with versioning
 * - featureFlags: Stores feature flag definitions and values
 * - auditLogs: Stores audit trail of all configuration changes (1-year TTL)
 * - configurationVersions: Stores snapshots of configuration at each version
 * 
 * Usage: node backend/scripts/setupCollections.js
 */

const mongoose = require('mongoose');
require('dotenv').config({ path: '.env' });

const { connectDB } = require('../config/db');

/**
 * Configuration Collection Schema
 * Stores individual configuration key-value pairs with metadata
 */
const configurationSchema = {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['key', 'value', 'type', 'environment', 'createdAt', 'updatedAt'],
      properties: {
        _id: { bsonType: 'objectId' },
        key: {
          bsonType: 'string',
          description: 'Configuration key (e.g., "branding.primaryColor")',
          minLength: 1,
          maxLength: 255
        },
        value: {
          description: 'Configuration value (any JSON-serializable type)'
        },
        type: {
          enum: ['string', 'number', 'boolean', 'object', 'array'],
          description: 'Type of configuration value'
        },
        description: {
          bsonType: 'string',
          description: 'Human-readable description of the configuration'
        },
        isSecret: {
          bsonType: 'bool',
          description: 'Whether value should be masked in logs'
        },
        environment: {
          enum: ['development', 'staging', 'production', 'all'],
          description: 'Environment this configuration applies to'
        },
        version: {
          bsonType: 'int',
          description: 'Version number for this key'
        },
        createdAt: {
          bsonType: 'date',
          description: 'Timestamp when configuration was created'
        },
        createdBy: {
          bsonType: 'string',
          description: 'User ID who created this configuration'
        },
        updatedAt: {
          bsonType: 'date',
          description: 'Timestamp when configuration was last updated'
        },
        updatedBy: {
          bsonType: 'string',
          description: 'User ID who last updated this configuration'
        },
        validationRules: {
          bsonType: 'object',
          properties: {
            required: { bsonType: 'bool' },
            pattern: { bsonType: 'string' },
            minLength: { bsonType: 'int' },
            maxLength: { bsonType: 'int' },
            minimum: { bsonType: 'int' },
            maximum: { bsonType: 'int' },
            enum: { bsonType: 'array' }
          }
        },
        metadata: {
          bsonType: 'object',
          properties: {
            category: { bsonType: 'string' },
            tags: { bsonType: 'array' },
            deprecated: { bsonType: 'bool' },
            deprecationMessage: { bsonType: 'string' }
          }
        }
      }
    }
  }
};

/**
 * Feature Flags Collection Schema
 * Stores feature flag definitions with targeting rules
 */
const featureFlagsSchema = {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['name', 'description', 'type', 'value', 'enabled', 'createdAt', 'updatedAt'],
      properties: {
        _id: { bsonType: 'objectId' },
        name: {
          bsonType: 'string',
          description: 'Feature flag name (e.g., "chatWidgetEnabled")',
          minLength: 1,
          maxLength: 255
        },
        description: {
          bsonType: 'string',
          description: 'Description of what this flag controls'
        },
        type: {
          enum: ['boolean', 'string', 'percentage'],
          description: 'Type of feature flag'
        },
        value: {
          description: 'Current value of the flag'
        },
        enabled: {
          bsonType: 'bool',
          description: 'Whether this flag is active'
        },
        rolloutPercentage: {
          bsonType: 'int',
          description: 'Percentage for gradual rollout (0-100)'
        },
        targetingRules: {
          bsonType: 'array',
          items: {
            bsonType: 'object',
            properties: {
              type: { enum: ['role', 'userId', 'attribute'] },
              operator: { enum: ['equals', 'contains', 'in'] },
              value: {},
              result: {}
            }
          }
        },
        owner: {
          bsonType: 'string',
          description: 'Team or person responsible for this flag'
        },
        createdAt: {
          bsonType: 'date',
          description: 'Timestamp when flag was created'
        },
        createdBy: {
          bsonType: 'string',
          description: 'User ID who created this flag'
        },
        updatedAt: {
          bsonType: 'date',
          description: 'Timestamp when flag was last updated'
        },
        updatedBy: {
          bsonType: 'string',
          description: 'User ID who last updated this flag'
        },
        metadata: {
          bsonType: 'object',
          properties: {
            tags: { bsonType: 'array' },
            deprecated: { bsonType: 'bool' },
            releaseNotes: { bsonType: 'string' }
          }
        }
      }
    }
  }
};

/**
 * Audit Logs Collection Schema
 * Stores audit trail of all configuration changes with 1-year TTL
 */
const auditLogsSchema = {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['timestamp', 'action', 'resourceType', 'resourceId'],
      properties: {
        _id: { bsonType: 'objectId' },
        timestamp: {
          bsonType: 'date',
          description: 'When the change occurred'
        },
        userId: {
          bsonType: 'string',
          description: 'User who made the change'
        },
        action: {
          enum: ['create', 'update', 'delete', 'rollback'],
          description: 'Type of action performed'
        },
        resourceType: {
          enum: ['configuration', 'featureFlag', 'secret'],
          description: 'Type of resource that was changed'
        },
        resourceId: {
          bsonType: 'string',
          description: 'ID of the changed resource'
        },
        resourceKey: {
          bsonType: 'string',
          description: 'Key of the changed resource (e.g., "branding.primaryColor")'
        },
        oldValue: {
          description: 'Previous value (masked if secret)'
        },
        newValue: {
          description: 'New value (masked if secret)'
        },
        reason: {
          bsonType: 'string',
          description: 'Why the change was made'
        },
        ipAddress: {
          bsonType: 'string',
          description: 'IP address of the user making the change'
        },
        userAgent: {
          bsonType: 'string',
          description: 'User agent of the request'
        },
        status: {
          enum: ['success', 'failed'],
          description: 'Whether the operation succeeded'
        },
        errorMessage: {
          bsonType: 'string',
          description: 'Error message if operation failed'
        },
        metadata: {
          bsonType: 'object',
          properties: {
            environment: { bsonType: 'string' },
            version: { bsonType: 'string' },
            rollbackFrom: { bsonType: 'string' }
          }
        }
      }
    }
  }
};

/**
 * Configuration Versions Collection Schema
 * Stores snapshots of all configurations at each version
 */
const configurationVersionsSchema = {
  validator: {
    $jsonSchema: {
      bsonType: 'object',
      required: ['versionId', 'timestamp', 'configurations', 'featureFlags'],
      properties: {
        _id: { bsonType: 'objectId' },
        versionId: {
          bsonType: 'string',
          description: 'Version identifier (e.g., "v1.2.3")',
          minLength: 1,
          maxLength: 50
        },
        timestamp: {
          bsonType: 'date',
          description: 'When this version was created'
        },
        createdBy: {
          bsonType: 'string',
          description: 'User who created this version'
        },
        description: {
          bsonType: 'string',
          description: 'Description of changes in this version'
        },
        configurations: {
          bsonType: 'object',
          description: 'Snapshot of all configurations at this version'
        },
        featureFlags: {
          bsonType: 'object',
          description: 'Snapshot of all feature flags at this version'
        },
        changes: {
          bsonType: 'array',
          items: {
            bsonType: 'object',
            properties: {
              key: { bsonType: 'string' },
              oldValue: {},
              newValue: {},
              reason: { bsonType: 'string' }
            }
          },
          description: 'List of changes in this version'
        }
      }
    }
  }
};

/**
 * Create collection with schema validation
 */
async function createCollection(db, collectionName, schema) {
  try {
    // Check if collection already exists
    const collections = await db.listCollections().toArray();
    const exists = collections.some(col => col.name === collectionName);

    if (exists) {
      console.log(`✓ Collection '${collectionName}' already exists`);
      return;
    }

    // Create collection with schema validation
    await db.createCollection(collectionName, schema);
    console.log(`✓ Created collection '${collectionName}' with schema validation`);
  } catch (error) {
    console.error(`✗ Error creating collection '${collectionName}':`, error.message);
    throw error;
  }
}

/**
 * Create indexes on collection
 */
async function createIndexes(db, collectionName, indexes) {
  try {
    const collection = db.collection(collectionName);
    
    for (const indexSpec of indexes) {
      const { fields, options } = indexSpec;
      try {
        await collection.createIndex(fields, options);
        console.log(`  ✓ Created index on ${collectionName}: ${JSON.stringify(fields)}`);
      } catch (indexError) {
        // Ignore "index already exists" errors
        if (indexError.message.includes('already exists')) {
          console.log(`  ℹ Index already exists on ${collectionName}: ${JSON.stringify(fields)}`);
        } else {
          throw indexError;
        }
      }
    }
  } catch (error) {
    console.error(`✗ Error creating indexes on '${collectionName}':`, error.message);
    throw error;
  }
}

/**
 * Main setup function
 */
async function setupCollections() {
  let connection = null;

  try {
    console.log('\n📦 Setting up MongoDB collections for Configuration Management System\n');

    // Connect to MongoDB
    console.log('🔗 Connecting to MongoDB...');
    connection = await connectDB();
    const db = connection.connection.db;
    console.log('✓ Connected to MongoDB\n');

    // Create collections
    console.log('📝 Creating collections...\n');

    await createCollection(db, 'configurations', configurationSchema);
    await createCollection(db, 'featureFlags', featureFlagsSchema);
    await createCollection(db, 'auditLogs', auditLogsSchema);
    await createCollection(db, 'configurationVersions', configurationVersionsSchema);

    console.log('\n📑 Creating indexes...\n');

    // Indexes for configurations collection
    await createIndexes(db, 'configurations', [
      { fields: { key: 1 }, options: { unique: true } },
      { fields: { environment: 1 }, options: {} },
      { fields: { createdAt: 1 }, options: {} },
      { fields: { updatedAt: 1 }, options: {} },
      { fields: { 'metadata.category': 1 }, options: {} },
      { fields: { key: 1, environment: 1 }, options: { unique: true } }
    ]);

    // Indexes for featureFlags collection
    await createIndexes(db, 'featureFlags', [
      { fields: { name: 1 }, options: { unique: true } },
      { fields: { enabled: 1 }, options: {} },
      { fields: { createdAt: 1 }, options: {} },
      { fields: { updatedAt: 1 }, options: {} },
      { fields: { owner: 1 }, options: {} }
    ]);

    // Indexes for auditLogs collection
    await createIndexes(db, 'auditLogs', [
      { fields: { timestamp: 1 }, options: {} },
      { fields: { userId: 1 }, options: {} },
      { fields: { resourceType: 1 }, options: {} },
      { fields: { resourceId: 1 }, options: {} },
      { fields: { action: 1 }, options: {} },
      { fields: { timestamp: 1, userId: 1 }, options: {} },
      { fields: { timestamp: 1 }, options: { expireAfterSeconds: 31536000 } } // 1 year TTL
    ]);

    // Indexes for configurationVersions collection
    await createIndexes(db, 'configurationVersions', [
      { fields: { versionId: 1 }, options: { unique: true } },
      { fields: { timestamp: 1 }, options: {} },
      { fields: { createdBy: 1 }, options: {} }
    ]);

    console.log('\n✅ MongoDB collections setup completed successfully!\n');
    console.log('Collections created:');
    console.log('  • configurations - Stores configuration key-value pairs');
    console.log('  • featureFlags - Stores feature flag definitions');
    console.log('  • auditLogs - Stores audit trail (1-year retention)');
    console.log('  • configurationVersions - Stores configuration snapshots\n');

  } catch (error) {
    console.error('\n❌ Setup failed:', error.message);
    process.exit(1);
  } finally {
    // Close connection
    if (connection) {
      await mongoose.disconnect();
      console.log('🔌 Disconnected from MongoDB\n');
    }
  }
}

// Run setup
setupCollections();
