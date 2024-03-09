import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, isValidObjectId } from 'mongoose';

import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Pokemon } from './entities/pokemon.entity';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PokemonService {
  private defaultLimit: number;

  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
    private readonly configService: ConfigService
  ) {

    this.defaultLimit = this.configService.get<number>('defaultLimit');
    console.log({defaultLimit: this.configService.get<number>('defaultLimit')})
  }

  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLocaleLowerCase();

    try {
      const pokemon = await this.pokemonModel.create(createPokemonDto);
      return pokemon;
    } catch (error) {
      this.handleException(error);
    }

  }

  async findAll(paginationDto: PaginationDto) {
    const { offset = 0, limit = this.defaultLimit } = paginationDto;
    const total = await this.pokemonModel.countDocuments();
    const pokemonList = await this.pokemonModel.find()
      .limit(limit).skip(offset)
      .sort({ no: 1 })
      .select('-__v');
    return {
      total,
      prev: (offset - limit) >= 0 ? `http://localhost:3000/api/v2/pokemon?offset=${offset - limit}&limit=${limit}` : null,
      next: (offset + limit < total) ? `http://localhost:3000/api/v2/pokemon?offset=${offset + limit}&limit=${limit}` : null,
      result: pokemonList
    };
  }

  async findOne(term: string) {

    let pokemon: Pokemon;

    //* Search By No
    if (!isNaN(+term)) {
      pokemon = await this.pokemonModel.findOne({ no: term })
    }
    //* Search Mongo ID
    if (!pokemon && isValidObjectId(term)) {
      pokemon = await this.pokemonModel.findById(term)
    }
    //* Search By Name
    if (!pokemon) {
      pokemon = await this.pokemonModel.findOne({ name: term.toLocaleLowerCase() })
    }

    if (!pokemon) throw new NotFoundException(`Pokemon with No:${term} not found`);
    return pokemon
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {
    const pokemon = await this.findOne(term);
    if (updatePokemonDto.name)
      updatePokemonDto.name = updatePokemonDto.name.toLowerCase();
    try {
      await pokemon.updateOne(updatePokemonDto);
      return { ...pokemon.toJSON(), ...updatePokemonDto };
    } catch (error) {
      this.handleException(error)
    }

  }

  async remove(id: string) {
    const { deletedCount } = await this.pokemonModel.deleteOne({
      _id: id
    });
    if (!deletedCount) throw new NotFoundException(`Pokemon with ID ${id} not found`);
    return !!deletedCount;
  }


  private handleException(error) {
    if (error.code === 11000) {
      throw new BadRequestException(`Already exists Pokemon in DB - ${JSON.stringify(error.keyValue)}`);
    }
    throw new InternalServerErrorException("Can't update Pokemon - Check Server Logs");
  }
}
