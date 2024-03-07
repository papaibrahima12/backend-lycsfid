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

@Entity()
export class Program {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, nullable: false })
  @ApiProperty({ required: true })
  nomProgram: string;

  @IsEnum(['palier achat', 'seuil achat'], {
    message: 'Veuillez selectionner un systeme de points valide',
  })
  @Column({
    type: 'enum',
    enum: ['palier achat', 'seuil achat'],
    nullable: false,
  })
  @ApiProperty({ required: true })
   systemePoint: string;

  @Column({ type: 'int', nullable: true })
  montantAttribution: number;

  @Column({ type: 'int', nullable: true })
  nombrePointsAttribution: number;

  @Column({ type: 'int', nullable: true })
  montantRedemption: number;

  @Column({ type: 'int', nullable: true })
  nombrePointsRedemption: number;

  @Column({ default: false })
  isActive: boolean;

  @Column({type:'timestamptz',nullable:true})
  @ApiProperty({required:false})
  dateActivation: Date;

  @ManyToOne(() => Entreprise, { nullable: false })
  @JoinColumn({ name: 'entrepriseId' })
  entreprise: Entreprise;
}
