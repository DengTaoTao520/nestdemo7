import {Body, Controller, Delete, Get, Inject, Param, Post, Put, Query} from '@nestjs/common';
import {ClientProxy} from '@nestjs/microservices';
import {InjectRepository} from '@nestjs/typeorm';
import {title} from 'node:process';
import {ProductService} from './product.service';



@Controller('products')
export class ProductController {
    constructor(
        private productService: ProductService,
        @Inject('PRODUTE_SERVICE') private readonly client: ClientProxy
    ) {
    }

    @Get()
    async all() {
        return this.productService.all();
    }


    @Get('/deletefirst')
    async deletefirst() {
        return this.productService.deletefirst();
    }



    @Post('/insert')
     insert(@Body('title') title: string,
            @Body('image') image: string,) {
        // console.time("测试");
        // console.log('dsfhdsjfgs')
        // console.timeEnd("测试");


          this.productService.insert({title, image});
    }


    @Get('/insertwhile')
    async insertwhile(@Body('title') title: string='1',
                      @Body('image') image: string='9',)
    {
        var i=0;
        console.time("nest插入一千条数据时间");
        while(i<1000)
        {
            this.productService.insert({title, image});
            i++;
        }
        console.timeEnd("nest插入一千条数据时间");
    }

    @Get('/insertll')
    async insertll( @Query() query)
    {
        const product= await this.productService.get(query.id);
        return product;
    }

    @Get('/insertee')
    async insertee(@Query() query)
    {
        const product= await this.productService.findone(query.id);
        return product;
    }



    @Get('/deletetopth')
    async deletetopth() {
        console.time("nest删除一千条数据时间");
        this.productService.deletetopth();
        console.timeEnd("nest删除一千条数据时间");
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


