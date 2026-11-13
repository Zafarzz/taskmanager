import {
    IsBoolean,
    IsInt,
    IsNotEmpty,
    IsString,
    IsArray,
    IsDateString,
    ArrayNotEmpty,
    ArrayMinSize,
    Min,
    Max,
    IsOptional,
  } from 'class-validator';
  
  export class CreateTaskDto {
    @IsInt()
    @Min(1)
    project_id: number;
  
    @IsString()
    @IsNotEmpty()
    name: string;
  
    @IsString()
    description: string;
  
    @IsOptional()
    @IsDateString()
    deadline?: string;
  
    @IsArray()
    @ArrayNotEmpty()
    @ArrayMinSize(1)
    participant: string[];
  
    @IsInt()
    @Min(1)
    @Max(5)
    priority: number;
  
    @IsInt()
    point: number;
  
    @IsOptional()
    @IsBoolean()
    is_backlog?: boolean;
  }
  