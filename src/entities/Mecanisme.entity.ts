import { ApiProperty } from "@nestjs/swagger";
import { IsEnum } from "class-validator";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Entreprise } from "./Entreprise.entity";

@Entity()
export class Mecanisme {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({type:'int',nullable:false})
  @ApiProperty({required:true})
  nombrePoints: number;

  @Column({type:'int',nullable:false})
  @ApiProperty({required:true})
  montant: number;

  @IsEnum(['attribution', 'redemption'],{message: 'Veuillez selectionner un type valide' })
  @Column({type:'enum', enum:['attribution','redemption'], nullable:false})
  @ApiProperty({required:true})
  type: string;

  @ManyToOne(() => Entreprise, { nullable:false })
  @JoinColumn({ name: 'entrepriseId' })
  entreprise: Entreprise;
}