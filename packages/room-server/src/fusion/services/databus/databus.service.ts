/**
 * APITable <https://github.com/apitable/apitable>
 * Copyright (C) 2022 APITable Ltd. <https://apitable.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import { databus } from '@apitable/core';
import { RedisService } from '@apitable/nestjs-redis';
import { Injectable } from '@nestjs/common';
import { CommandService } from 'database/services/command/command.service';
import { DatasheetChangesetSourceService } from 'database/services/datasheet/datasheet.changeset.source.service';
import { DatasheetService } from 'database/services/datasheet/datasheet.service';
import { OtService } from 'database/services/ot/ot.service';
import { InjectLogger } from 'shared/common';
import { Logger } from 'winston';
import { IServerDatasheetOptions } from './interfaces';
import { ServerDataStorageProvider } from './server.data.storage.provider';

@Injectable()
export class DataBusService {
  private readonly databus: databus.DataBus;
  private readonly database: databus.Database;

  constructor(
    datasheetService: DatasheetService,
    commandService: CommandService,
    redisService: RedisService,
    otService: OtService,
    changesetSourceService: DatasheetChangesetSourceService,
    @InjectLogger() private readonly logger: Logger,
  ) {
    this.databus = databus.DataBus.create({
      dataStorageProvider: new ServerDataStorageProvider(
        {
          datasheetService,
          redisService,
          otService,
          changesetSourceService,
          loadOptions: {
            useCache: false,
          },
        },
        logger,
      ),
      storeProvider: {
        createStore: datasheetPack => Promise.resolve(commandService.fullFillStore(datasheetPack)),
      },
    });
    this.database = this.databus.getDatabase();
  }

  async getDatasheet(dstId: string, options: IServerDatasheetOptions): Promise<databus.Datasheet | null> {
    const datasheet = await this.database.getDatasheet(dstId, options);
    if (datasheet === null) {
      return null;
    }
    datasheet.addEventHandler({
      type: databus.event.DatasheetEventType.CommandExecuted,
      handle: (event: databus.event.IDatasheetCommandExecutedEvent) => {
        if ('error' in event) {
          this.logger.error('CommandExecuteError', { error: event.error });
          return;
        }

        return;
      },
    });

    return datasheet;
  }
}
