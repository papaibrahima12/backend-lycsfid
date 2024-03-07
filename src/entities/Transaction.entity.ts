import { ApiProperty } from "@nestjs/swagger";
import { IsEnum } from "class-validator";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Entreprise } from "./Entreprise.entity";
import { Particulier } from "./Particulier.entity";

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Particulier, { nullable:false })
  @JoinColumn({ name: 'clientId' })
  client: Particulier;

  @Column({type:'int',nullable:false})
  @ApiProperty({required:true})
  nombrePoints: number;

  @Column({type:'int',nullable:false})
  @ApiProperty({required:true})
  montant: number;

  @Column({type:'timestamptz', nullable:true})
  @ApiProperty({required:false})
  date: Date;

  @ManyToOne(() => Entreprise, { nullable:false })
  @JoinColumn({ name: 'entrepriseId' })
  entreprise: Entreprise;
}