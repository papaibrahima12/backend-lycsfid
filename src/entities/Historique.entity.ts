import { ApiProperty } from "@nestjs/swagger";
import { IsEnum } from "class-validator";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Entreprise } from "./Entreprise.entity";
import { Particulier } from "./Particulier.entity";

@Entity()
export class Historique {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({type:'int',nullable:false})
  @ApiProperty({required:true})
  nombrePoints: number;

  @Column({type:'int',nullable:false})
  @ApiProperty({required:true})
  montant: number;

  @IsEnum(['attribution', 'utilisation'],{message: 'Veuillez selectionner un type valide' })
  @Column({type:'enum', enum:['attribution','utilisation'], nullable:false})
  @ApiProperty({required:true})
  typeTransaction: string;

  @ManyToOne(() => Particulier, (particulier) => particulier.soldePoints)
  @JoinColumn({ name: 'clientId' })
  client: Particulier;

  @ManyToOne(() => Entreprise, { nullable:false })
  @JoinColumn({ name: 'entrepriseId' })
  entreprise: Entreprise;

  @Column({type:'timestamptz',nullable:true})
  @ApiProperty({required:false})
  dateTransaction: Date;

  @Column({default:false})
  isCanceled: boolean;
}