/*
 * CloudBeaver - Cloud Database Manager
 * Copyright (C) 2020-2021 DBeaver Corp and others
 *
 * Licensed under the Apache License, Version 2.0.
 * you may not use this file except in compliance with the License.
 */

import { injectable } from '@cloudbeaver/core-di';
import { ServerConfigResource } from '@cloudbeaver/core-root';
import {
  GraphQLService,
  CachedDataResource,
  AuthProviderInfo
} from '@cloudbeaver/core-sdk';

export type AuthProvider = AuthProviderInfo;

@injectable()
export class AuthProvidersResource extends CachedDataResource<AuthProvider[], void> {
  constructor(
    private graphQLService: GraphQLService,
    private serverConfigResource: ServerConfigResource
  ) {
    super([]);

    this.serverConfigResource.onDataOutdated.addHandler(() => this.markOutdated());
    this.serverConfigResource.onDataUpdate.addHandler(async () => { await this.load(); });
  }

  has(id: string): boolean {
    return this.data.some(provider => provider.id === id);
  }

  getEnabledProviders(): string[] {
    return this.serverConfigResource.data?.enabledAuthProviders ?? [];
  }

  isEnabled(id: string): boolean {
    return this.serverConfigResource.data?.enabledAuthProviders.includes(id) ?? false;
  }

  protected async loader(): Promise<AuthProvider[]> {
    const { providers } = await this.graphQLService.sdk.getAuthProviders();
    return providers;
  }
}
