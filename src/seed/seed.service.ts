import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';

import { PokeResponse } from './interfaces/poke-response.interface';

@Injectable()
export class SeedService {

  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,

    private readonly http: AxiosAdapter,
  ) {}

  

  // INSERT SEED EFFICIENTLY
  async executeSeed(){

    await this.pokemonModel.deleteMany({}) // delete * from pokemons

    const data = await this.http.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=650')

    const pokemonToInsert: {name: string, no: number}[] = [];
    
    data.results.forEach(({name, url}) => {  
      const segments = url.split('/')
      const no = +segments[segments.length - 2]
      // await this.pokemonModel.create({name, no})

      pokemonToInsert.push({name, no})
    })

    await this.pokemonModel.insertMany(pokemonToInsert)
    
    return 'seed executed'
  }

}


/* FORMA DE EJECUTAR UNA SEED  */

// async executeSeed(){

//   await this.pokemonModel.deleteMany({}) // delete * from pokemons

//   const { data } = await this.axios.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=10')

//   const insertPromisesArray = [];
  
//   data.results.forEach(({name, url}) => {  
//     const segments = url.split('/')
//     const no = +segments[segments.length - 2]
//     // await this.pokemonModel.create({name, no})

//     insertPromisesArray.push(
//       this.pokemonModel.create({name, no})
//     )
//   })

//   await Promise.all(insertPromisesArray)

//   return 'seed executed'
// }

// }
