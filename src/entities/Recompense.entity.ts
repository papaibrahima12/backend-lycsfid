import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Entreprise } from './Entreprise.entity';
import { Particulier } from './Particulier.entity';

@Entity()
export class Recompense {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  @ApiProperty({ required: true })
  nomRecompense: string;

  @Column({ type: 'int', nullable: false })
  @ApiProperty({ required: true })
  valeurEnPoints: number;

  @Column({ type: 'int', nullable: false })
  @ApiProperty({ required: true })
  montant: number;

  @Column({
    type: 'enum',
    enum: ['actif', 'inactif'],
    nullable: false,
    default: 'actif'
  })
  @ApiProperty({ required: true })
   statut: string;

   @Column({type:'timestamptz',nullable:true})
   @ApiProperty({required:false})
   dateActivation: Date;

   @IsEnum([1, 7, 30],{message: 'Veuillez selectionner une durée valide' })
   @Column({ 
    type: 'enum',
    enum: [1, 7, 30],
    nullable: false,
    })
   @ApiProperty({ required: true })
   dureeValidite: number;

   @ManyToOne(() => Entreprise, { nullable: false })
   @JoinColumn({ name: 'entrepriseId' })
   entreprise: Entreprise;
}