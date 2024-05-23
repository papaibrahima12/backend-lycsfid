import { ApiProperty } from "@nestjs/swagger";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Entreprise } from "./Entreprise.entity";
import { Particulier } from "./Particulier.entity";

@Entity()
export class RecompensePart {
  @PrimaryGeneratedColumn()
  id: number;
  
  @Column({ type: 'varchar', length: 255, nullable: true })
  @ApiProperty({ required: true })
  nomRecompense: string;

  @Column({type:'int',nullable:false})
  @ApiProperty({required:true})
  nombrePoints: number;

  @Column({type:'int',nullable:false})
  @ApiProperty({required:true})
  montant: number;

  @Column({type:'timestamptz',nullable:true})
  @ApiProperty({required:false})
  dateExp: Date;
 
  @ManyToOne(() => Particulier, { nullable: false })
  @JoinColumn({ name: 'clientId' })
  client: Particulier;

  @ManyToOne(() => Entreprise, { nullable: false })
  @JoinColumn({ name: 'entrepriseId' })
  entreprise: Entreprise;

  @Column({default:false})
  isExpired: boolean;
}