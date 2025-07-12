#!/usr/bin/env node

// Comprehensive Type Consistency Fix Script
// This script fixes the major ID type mismatches in the schema

import fs from 'fs';

console.log('🔧 Starting comprehensive type consistency fixes...');

// Read the schema file
const schemaPath = 'shared/schema.ts';
let schema = fs.readFileSync(schemaPath, 'utf8');

// Fix 1: Standardize businessEntityId to varchar (matches businessEntities.id)
console.log('📝 Fixing businessEntityId type consistency...');
schema = schema.replace(
  /businessEntityId: integer\("business_entity_id"\)\.references\(\(\) => businessEntities\.id\)/g,
  'businessEntityId: varchar("business_entity_id").references(() => businessEntities.id)'
);

schema = schema.replace(
  /businessEntityId: integer\("business_entity_id"\)\.notNull\(\)\.references\(\(\) => businessEntities\.id\)/g,
  'businessEntityId: varchar("business_entity_id").notNull().references(() => businessEntities.id)'
);

// Fix 2: Add missing serviceType field to document_requests
console.log('📝 Adding missing serviceType field...');
if (!schema.includes('serviceType: varchar("service_type")')) {
  schema = schema.replace(
    /documentName: varchar\("document_name"\)\.notNull\(\),/,
    `documentName: varchar("document_name").notNull(),
  serviceType: varchar("service_type"),`
  );
}

// Fix 3: Fix Stripe product_data type
console.log('📝 Fixing Stripe type consistency...');
schema = schema.replace(
  /product_data:/g,
  'product:'
);

// Fix 4: Add proper error typing
console.log('📝 Adding proper error handling types...');
const errorHandlingCode = `
// Type-safe error handling utility
export function isError(error: unknown): error is Error {
  return error instanceof Error;
}

export function getErrorMessage(error: unknown): string {
  if (isError(error)) {
    return error.message;
  }
  return String(error);
}
`;

if (!schema.includes('isError(error: unknown)')) {
  schema += errorHandlingCode;
}

// Fix 5: Add proper type conversion utilities
console.log('📝 Adding type conversion utilities...');
const typeUtilities = `
// Safe type conversion utilities
export function toStringId(id: number | string | null | undefined): string {
  if (id === null || id === undefined) {
    throw new Error('ID cannot be null or undefined');
  }
  return String(id);
}

export function toNumberId(id: string | number | null | undefined): number {
  if (id === null || id === undefined) {
    throw new Error('ID cannot be null or undefined');
  }
  const numId = typeof id === 'string' ? parseInt(id, 10) : id;
  if (isNaN(numId)) {
    throw new Error(\`Invalid ID: \${id}\`);
  }
  return numId;
}
`;

if (!schema.includes('toStringId(id:')) {
  schema += typeUtilities;
}

// Write the fixed schema
fs.writeFileSync(schemaPath, schema);
console.log('✅ Schema fixes applied successfully!');

// Fix routes.ts - Add proper type guards and conversions
console.log('📝 Fixing routes.ts type issues...');
const routesPath = 'server/routes.ts';
let routes = fs.readFileSync(routesPath, 'utf8');

// Add type imports at the top
if (!routes.includes('import { toStringId, toNumberId, getErrorMessage }')) {
  routes = routes.replace(
    /import.*from.*@shared\/schema.*;\n/,
    `$&import { toStringId, toNumberId, getErrorMessage } from "@shared/schema";\n`
  );
}

// Fix number to string conversions systematically
const numberToStringFixes = [
  [/eq\(businessEntities\.id, (\w+)\)/g, 'eq(businessEntities.id, toStringId($1))'],
  [/eq\(users\.id, (\w+)\)/g, 'eq(users.id, toStringId($1))'],
  [/eq\(documents\.id, (\w+)\)/g, 'eq(documents.id, toNumberId($1))'],
  [/req\.user\.claims\.sub/g, 'toStringId(req.user.claims.sub)'],
  [/catch \(error\) {[\s\S]*?console\.error.*error.*;\s*res\.status\(500\)/g, 
   'catch (error: unknown) {\n      console.error("Error:", getErrorMessage(error));\n      res.status(500)']
];

numberToStringFixes.forEach(([pattern, replacement]) => {
  routes = routes.replace(pattern, replacement);
});

fs.writeFileSync(routesPath, routes);
console.log('✅ Routes.ts fixes applied successfully!');

console.log('\n🎉 All type consistency fixes completed!');
console.log('📋 Summary of fixes:');
console.log('   ✓ Standardized businessEntityId types to varchar');
console.log('   ✓ Added missing serviceType field');
console.log('   ✓ Fixed Stripe type definitions'); 
console.log('   ✓ Added proper error handling utilities');
console.log('   ✓ Added type conversion utilities');
console.log('   ✓ Fixed ID type conversions in routes');
console.log('\n💡 Run `npm run db:push` to apply database changes');