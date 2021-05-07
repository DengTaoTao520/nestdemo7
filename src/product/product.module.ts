import {Module} from '@nestjs/common';
import {ClientsModule, Transport} from '@nestjs/microservices';
import {TypeOrmModule} from '@nestjs/typeorm';
import {ProductController} from './product.controller';
import {Product} from './product.entity';
import {ProductService} from './product.service';


@Module({
    imports: [
        TypeOrmModule.forFeature([Product]),
        ClientsModule.register([
            {
                name: 'PRODUTE_SERVICE',
                transport: Transport.RMQ,
                options: {
                    urls: ['amqps://zvdgdkzf:aCof4rZDjG7gKhiOVXgsSgHmLmNNAgHN@clam.rmq.cloudamqp.com/zvdgdkzf'],
                    queue: 'main_queue',
                    queueOptions: {
                        durable: false

                    },
                },
            },
        ]),
    ],

    controllers: [ProductController],

    providers: [ProductService]
})
export class ProductModule {
}
