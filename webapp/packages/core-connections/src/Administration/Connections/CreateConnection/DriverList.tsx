/*
 * cloudbeaver - Cloud Database Manager
 * Copyright (C) 2020 DBeaver Corp and others
 *
 * Licensed under the Apache License, Version 2.0.
 * you may not use this file except in compliance with the License.
 */

import { observer } from 'mobx-react';
import { useState, useMemo } from 'react';

import { ItemListSearch, ItemList } from '@cloudbeaver/core-blocks';

import { DBDriver } from '../../../DBDriverResource';
import { Driver } from './Driver';

type Props = {
  drivers: DBDriver[];
  className?: string;
  onSelect(driverId: string): void;
}

export const DriverList = observer(function DriverList({ drivers, className, onSelect }: Props) {
  const [search, setSearch] = useState('');
  const filteredDrivers = useMemo(() => {
    if (!search) {
      return drivers;
    }
    return drivers.filter(driver => driver.name?.toUpperCase().includes(search.toUpperCase()));
  }, [search, drivers]);

  return (
    <ItemList className={className}>
      <ItemListSearch onSearch={setSearch} />
      {filteredDrivers.map(driver => <Driver key={driver.id} driver={driver} onSelect={onSelect}/>)}
    </ItemList>
  );
});
