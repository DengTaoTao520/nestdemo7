import {BadRequestException, Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
// @ts-ignore
import {getConnection, Repository} from 'typeorm';
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

    async insert(data){
          this.productRespository.save(data);
    }

    async deletefirst(): Promise<string> {
        const connection = getConnection();
        const queryRunner = connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
         try {
            await queryRunner.manager.query('delete from product limit 1');
            await queryRunner.commitTransaction();
            await queryRunner.release();
            return '删除成功';

        } catch (e) {
        //     // await queryRunner.rollbackTransaction();
        //     throw new BadRequestException('删除失败');
             return '删除失败'
        }


    }


    async deletetopth() {
        const connection = getConnection();
        const queryRunner = connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            await queryRunner.manager.query('delete from product where 1=1 order by id limit 1000');
            await queryRunner.commitTransaction();
            await queryRunner.release();


        } catch (e) {
            //     // await queryRunner.rollbackTransaction();
            //     throw new BadRequestException('删除失败');

        }


    }



    Delete(id: number) {
         this.productRespository.delete(id);
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


    async findone(id: number) : Promise<Product> {
        const connection = getConnection();
        const firstUser = connection
            .getRepository(Product)
            .createQueryBuilder("product")
            .where("product.id = :id", { id })
            .getOne();
        return firstUser;
    }
}
