// src/api/abstractions/Abstract.ts
import { Injectable } from '@nestjs/common';
import { client } from 'src/discordjs';
import { ClientFetcher } from '../utils';

@Injectable()
export class Abstract {
  clientFetcher: ClientFetcher;

  constructor() {
    this.clientFetcher = new ClientFetcher(client);
  }
}
