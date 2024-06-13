import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Entreprise } from "./Entreprise.entity";
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from "class-validator";

@Entity()
export class StatsCompanies {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({type:'integer',nullable:true})
  @ApiPropertyOptional({required:false})
  nombreEntreprises: number;

  @Column({ default: false })
  verified: boolean;

  @IsNotEmpty({message: "La date de debut ne doit pas etre vide !"})
  @Column({type:'date',nullable:true})
  @ApiProperty({required:true})
  dateCreation: Date;
  
  @ManyToOne(() => Entreprise, { nullable:false })
  @JoinColumn({ name: 'entrepriseId' })
  entreprise: Entreprise;
}
