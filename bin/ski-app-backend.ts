#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { SkiAppBackendStack } from '../lib/ski-app-backend-stack';

const app = new cdk.App();
new SkiAppBackendStack(app, 'SkiAppBackendStack');
