import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Entreprise } from "./Entreprise.entity";
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from "class-validator";

@Entity()
export class StatsRecompenses {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({type:'integer',nullable:true})
  @ApiPropertyOptional({required:false})
  nombreRecompenses: number;

  @Column({type:'date',nullable:true})
  @ApiProperty({required:true})
  dateCreation: Date;
  
  @ManyToOne(() => Entreprise, { nullable:false })
  @JoinColumn({ name: 'entrepriseId' })
  entreprise: Entreprise;
}
