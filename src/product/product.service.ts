import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {Product} from './product.entity';

@Injectable()
export class ProductService {
    constructor(
        @InjectRepository(Product) private readonly productRespository: Repository<Product>
    ) {

    }

    async all(): Promise<Product[]> {
        return this.productRespository.find();
    }

    async create(data): Promise<Product> {
        return this.productRespository.save(data);
    }

    async get(id: number): Promise<Product> {
        return this.productRespository.findOne({id});
    }

    async update(id: number, data): Promise<any> {
        return this.productRespository.update(id, data);
    }

    async delete(id: number): Promise<any> {
        return this.productRespository.delete(id);
    }

}
