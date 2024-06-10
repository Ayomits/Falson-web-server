import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { VerificationService } from './verification.service';


@Controller('verification')
export class VerificationController {
  constructor(private readonly verificationService: VerificationService) {}

  
}
