import { Global, Module } from '@nestjs/common';
import { ClientStorage } from 'shared/services/socket/client.storage';
import { GrpcClientModule } from 'proto/client/grpc.client.module';
import { OtModule } from '../../../database/_modules/ot.module';
import { RoomResourceRelService } from './room.resource.rel.service';
import { UserServiceModule } from '../../../database/_modules/user.service.module';
import { ResourceServiceModule } from '../../../database/_modules/resource.service.module';
import { NodeServiceModule } from '../../../database/_modules/node.service.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatasheetRepository } from '../../../database/repositories/datasheet.repository';
import { WidgetRepository } from '../../../database/repositories/widget.repository';
import { ResourceMetaRepository } from '../../../database/repositories/resource.meta.repository';
import { DatasheetServiceModule } from '../../../database/_modules/datasheet.service.module';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([DatasheetRepository, ResourceMetaRepository, WidgetRepository]),
    OtModule,
    UserServiceModule,
    ResourceServiceModule,
    NodeServiceModule,
    DatasheetServiceModule,
    GrpcClientModule
  ],
  providers: [RoomResourceRelService, ClientStorage],
  exports: [RoomResourceRelService, ClientStorage],
})
export class SocketModule {}
