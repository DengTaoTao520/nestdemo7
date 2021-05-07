import {Body, Controller, Delete, Get, Inject, Param, Post, Put} from '@nestjs/common';
import {ClientProxy} from '@nestjs/microservices';
import {InjectRepository} from '@nestjs/typeorm';
import {title} from 'node:process';
import {ProductService} from './product.service';

@Controller('products')
export class ProductController {
    constructor(private productService: ProductService,
                @Inject('PRODUTE_SERVICE') private readonly client: ClientProxy
    ) {
    }

    @Get()
    async all() {
        return this.productService.all();
    }

    @Post()
    async create(@Body('title') title: string,
                 @Body('image') image: string,
    ) {
        const product = await this.productService.create({
            title,
            image
        });
        this.client.emit('product_created', product);
        return product;
    }

    @Get(':id')
    async get(@Param('id')id: number) {
        return this.productService.get(id);
    }

    @Put(':id')
    async update(
        @Param('id') id: number,
        @Body('title') title: string,
        @Body('image') image: string,
    ) {
        await this.productService.update(id, {
            title,
            image
        });
        const product = await this.productService.get(id);
        this.client.emit('product_updated', product);
        return product;
    }

    @Delete(':id')
    async delete(@Param('id') id: number) {
        await this.productService.delete(id);

        this.client.emit('product_delete', id);
    }

    @Post(':id/like')
    async like(@Param('id') id: number) {
        const product = await this.productService.get(id);

        return this.productService.update(id, {

            likes: product.likes + 1
        });
    }

}


